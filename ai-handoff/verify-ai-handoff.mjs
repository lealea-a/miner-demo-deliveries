#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const handoffRoot = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(handoffRoot, '..');
const expected = Object.freeze({
  repository: 'https://github.com/lealea-a/lea.git',
  deliveryBranch: 'codex/field-miner-web-v1-delivery',
  sourceBranch: 'codex/field-miner-landscape-owner-handoff-final',
  releaseAuthorityCommit: '630aff1f9f1553b0a948d22ad9487aca1712c13f',
  bundlePath: 'field-miner-owner-delivery-v01.zip',
  bundleSha256: 'DCC1239F98B21FDDC7A2B8504AF2F9839130F4C68221E1548885E339952CD096',
  bundleGitBlob: 'e814e8d434d01f7c6099d36caf49cae753d10c20',
  deploymentContract: 'HANDOFF.md',
  releases: [
    { id: 'portrait-v10', path: 'portrait-site', fileCount: 56, manifest: 'portrait-site/FILES.sha256', entry: 'field-entry-exit-trial.html', prefix: '/field-miner-mobile-v01/', sourceSha256: 'C78F06DF9E284ECCE589736EFD9481121439D2722006E6584C03646F705071CB' },
    { id: 'landscape-v05', path: 'landscape-site', fileCount: 46, manifest: 'landscape-site/FILES.sha256', entry: 'index.html', prefix: '/field-miner-landscape-simple-guide-v01/', sourceSha256: '4D3BE9FAC1CF0CA05D693C62237EA343330F1A8CC375CF696433A0267CDA2E82' },
  ],
});

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex').toUpperCase();
const fail = (code) => { throw new Error(code); };

async function readJson(file, code) {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${code}:${error?.message ?? error}`); }
}

function resolvePath(relative, code) {
  if (typeof relative !== 'string' || path.isAbsolute(relative)) fail(code);
  const resolved = path.resolve(projectRoot, ...relative.split('/'));
  if (resolved !== projectRoot && !resolved.startsWith(`${projectRoot}${path.sep}`)) fail(code);
  return resolved;
}

function git(...args) {
  return execFileSync('git', args, { cwd: projectRoot, encoding: 'utf8', windowsHide: true }).trim();
}

async function listFiles(root, relative = '') {
  const output = [];
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) output.push(...await listFiles(root, next));
    else if (entry.isFile()) output.push(next.replaceAll(path.sep, '/'));
  }
  return output.sort();
}

async function assertPayload(release, spec) {
  const root = resolvePath(release.staticPayload.path, 'FIELD_MINER_STATIC_PAYLOAD_PATH_INVALID');
  const files = await listFiles(root);
  if (files.length !== spec.fileCount) fail(`FIELD_MINER_STATIC_PAYLOAD_COUNT_INVALID:${spec.id}`);
  if (!files.includes(release.entry)) fail(`FIELD_MINER_ENTRY_MISSING:${spec.id}`);

  const lines = (await readFile(resolvePath(release.staticPayload.checksumManifest, 'FIELD_MINER_MANIFEST_PATH_INVALID'), 'utf8')).split(/\r?\n/u).filter(Boolean);
  const declared = new Map();
  for (const line of lines) {
    const match = /^([0-9a-fA-F]{64})  (.+)$/u.exec(line);
    if (!match || declared.has(match[2])) fail(`FIELD_MINER_MANIFEST_INVALID:${spec.id}`);
    declared.set(match[2], match[1].toUpperCase());
  }
  const payloadFiles = files.filter((file) => file !== 'FILES.sha256');
  if (declared.size !== payloadFiles.length) fail(`FIELD_MINER_MANIFEST_COUNT_INVALID:${spec.id}`);
  for (const relative of payloadFiles) {
    const actual = sha256(await readFile(path.join(root, ...relative.split('/'))));
    if (declared.get(relative) !== actual) fail(`FIELD_MINER_MANIFEST_HASH_INVALID:${spec.id}:${relative}`);
  }
}

async function assertContract(contract) {
  if (
    contract?.kind !== 'FIELD_MINER_OWNER_DEPLOYMENT_HANDOFF'
    || contract?.status !== 'READY_FOR_OWNER_STAGING'
    || contract?.generatedFrom?.repository !== expected.repository
    || contract?.generatedFrom?.branch !== expected.sourceBranch
    || contract?.generatedFrom?.releaseAuthorityCommit !== expected.releaseAuthorityCommit
  ) fail('FIELD_MINER_HANDOFF_IDENTITY_INVALID');

  if (
    contract?.bundle?.path !== expected.bundlePath
    || contract?.bundle?.sha256 !== expected.bundleSha256
    || contract?.bundle?.gitBlob !== expected.bundleGitBlob
  ) fail('FIELD_MINER_BUNDLE_CONTRACT_INVALID');

  const bundle = resolvePath(contract.bundle.path, 'FIELD_MINER_BUNDLE_PATH_INVALID');
  if (sha256(await readFile(bundle)) !== expected.bundleSha256) fail('FIELD_MINER_BUNDLE_SHA_INVALID');
  if (git('rev-parse', `HEAD:${contract.bundle.path}`) !== expected.bundleGitBlob) fail('FIELD_MINER_BUNDLE_GIT_BLOB_INVALID');

  if (!Array.isArray(contract.releases) || contract.releases.length !== expected.releases.length) fail('FIELD_MINER_RELEASE_COUNT_INVALID');
  for (let index = 0; index < expected.releases.length; index += 1) {
    const release = contract.releases[index];
    const spec = expected.releases[index];
    if (
      release?.id !== spec.id
      || release?.staticPayload?.path !== spec.path
      || release?.staticPayload?.fileCount !== spec.fileCount
      || release?.staticPayload?.checksumManifest !== spec.manifest
      || release?.staticPayload?.sourceArchiveSha256 !== spec.sourceSha256
      || release?.entry !== spec.entry
      || release?.publicPrefix !== spec.prefix
    ) fail(`FIELD_MINER_RELEASE_CONTRACT_INVALID:${spec.id}`);
    await assertPayload(release, spec);
  }

  if (
    contract?.deploymentContract !== expected.deploymentContract
    || contract?.preflight?.command !== 'node ai-handoff/verify-ai-handoff.mjs'
    || contract?.preflight?.expectedStatus !== 'PASS'
    || contract?.deploymentPolicy?.deployFrozenPayloadsOnly !== true
    || contract?.deploymentPolicy?.rebuildForbidden !== true
    || contract?.deploymentPolicy?.postExtractionMutationForbidden !== true
    || contract?.deploymentPolicy?.atomicPromotionRequired !== true
    || contract?.deploymentPolicy?.abortOnFirstFailure !== true
    || contract?.deploymentPolicy?.exactPublicPrefixesRequired !== true
    || contract?.deploymentPolicy?.portraitServiceWorkerUploadLast !== true
  ) fail('FIELD_MINER_DEPLOYMENT_POLICY_INVALID');

  await readFile(resolvePath(expected.deploymentContract, 'FIELD_MINER_HANDOFF_PATH_INVALID'));
}

const contractPath = path.join(handoffRoot, 'AI-HANDOFF.json');
const contractBytes = await readFile(contractPath);
const contract = JSON.parse(contractBytes.toString('utf8'));
const handoffSchema = await readJson(path.join(handoffRoot, 'AI-HANDOFF.schema.json'), 'FIELD_MINER_HANDOFF_SCHEMA_JSON_INVALID');
const resultSchema = await readJson(path.join(handoffRoot, 'DEPLOYMENT-RESULT.schema.json'), 'FIELD_MINER_RESULT_SCHEMA_JSON_INVALID');
const resultTemplate = await readJson(path.join(handoffRoot, 'DEPLOYMENT-RESULT.template.json'), 'FIELD_MINER_RESULT_TEMPLATE_JSON_INVALID');

if (handoffSchema?.$schema !== 'https://json-schema.org/draft/2020-12/schema' || handoffSchema?.$id !== 'urn:lea:field-miner:ai-handoff:1') fail('FIELD_MINER_HANDOFF_SCHEMA_INVALID');
if (resultSchema?.$schema !== 'https://json-schema.org/draft/2020-12/schema' || resultSchema?.$id !== 'urn:lea:field-miner:deployment-result:1') fail('FIELD_MINER_RESULT_SCHEMA_INVALID');
await assertContract(contract);

const handoffSha256 = sha256(contractBytes);
if (
  resultTemplate?.handoffSha256 !== handoffSha256
  || resultTemplate?.status !== 'PENDING'
  || resultTemplate?.releases?.length !== 2
  || resultTemplate.releases.some((release, index) => release.id !== expected.releases[index].id || release.archiveSha256 !== expected.releases[index].sourceSha256)
) fail('FIELD_MINER_RESULT_TEMPLATE_INVALID');

const [readme, handoff] = await Promise.all([
  readFile(resolvePath('README.md', 'FIELD_MINER_README_PATH_INVALID'), 'utf8'),
  readFile(resolvePath('HANDOFF.md', 'FIELD_MINER_HANDOFF_PATH_INVALID'), 'utf8'),
]);
if (!readme.includes('ai-handoff/AI-HANDOFF.json') || !handoff.includes('ai-handoff/AI-HANDOFF.json')) fail('FIELD_MINER_SOURCE_OF_TRUTH_REFERENCE_MISSING');

let mutationDetected = false;
try {
  const mutated = structuredClone(contract);
  mutated.bundle.sha256 = '0'.repeat(64);
  await assertContract(mutated);
} catch (error) {
  mutationDetected = String(error?.message).includes('FIELD_MINER');
}
if (!mutationDetected) fail('FIELD_MINER_NEGATIVE_CONTROL_FAILED');

console.log(JSON.stringify({
  status: 'PASS',
  artifact: 'FIELD_MINER_AI_TO_AI_DEPLOYMENT_HANDOFF_V01',
  handoffSha256,
  bundleSha256: contract.bundle.sha256,
  releases: contract.releases.map((release) => ({ id: release.id, fileCount: release.staticPayload.fileCount, publicPrefix: release.publicPrefix })),
  negativeControls: { bundleDigestMutationDetected: true },
  deploymentStatus: 'NOT_DEPLOYED',
}, null, 2));

