import  Client  from '@botpress/client';

const main = async () => {
  const token = 'your-token';
  const workspaceId = 'your-workspace-id';
  const client = new Client({ token, workspaceId });

  const allBots = [];
  let nextToken;

  do {
    const resp = await client.listBots({ nextToken });
    nextToken = resp.meta.nextToken;
    allBots.push(...resp.bots);
  } while (nextToken);

  console.log(allBots);
};

void main();
