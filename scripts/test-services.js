(async ()=>{
  const { inferEmbedding, upsertVector, queryVector } = require('../src/lib/services/remoteClients');
  console.log('Requesting embedding...');
  const emb = await inferEmbedding('prototype-model', 'hello world');
  console.log('Embedding length:', emb.embedding.length);
  console.log('Upserting vector...');
  const up = await upsertVector('doc-1', emb.embedding);
  console.log('Upsert response:', up);
  console.log('Querying...');
  const q = await queryVector(emb.embedding);
  console.log('Query response:', q);
})();
