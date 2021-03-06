import { Meteor } from 'meteor/meteor';
import faker from 'faker';
import { createCluster } from '/server/imports/db/clusters/create';
import { createServer } from '/server/imports/db/servers/create';
import { createGeometry } from '/server/imports/db/geometries/create';
import { createCalculation } from '/server/imports/db/calculations/create';

const createTestData = () => {
  // console.log('test: Creating data...');
  const userId = Meteor.users.insert({
    profile: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      settings: {},
    },
  });
  const serverId = createServer({
    _id: 'free',
    name: 'free',
    nodeSize: 1,
    maxNodes: 500,
    type: 'all',
  });
  const clusterId = createCluster({
    _id: 'free',
    name: 'Free Cluster',
    userId,
    size: 1,
    serverId,
  });
  const geometryId = createGeometry({
    userId,
    tags: ['test'],
    xyz: `sugar
      C     0.00010350    -0.00002292     0.00005958
      C     1.45231106    -0.40161983    -0.17350624
      C     2.34458902     0.02958891     0.98452565
      C     3.25215947    -0.08238094    -1.74168405
      C     3.78537359    -0.36385876     0.70549140
      C     4.26121012     0.18344319    -0.62938590
      H    -0.53559623    -0.15972281    -0.93664015
      H    -0.48893205    -0.59111787     0.77496172
      H    -0.08331875     1.05809607     0.26189755
      H     1.19256350    -0.21181943     2.54237356
      H     1.51426730    -1.49340963    -0.27334811
      H     2.30234279     1.12603950     1.07182660
      H     2.58870456    -1.66362233    -2.58227339
      H     3.47422110     0.60040622    -2.57224157
      H     3.83703148    -1.46039955     0.70418275
      H     4.37163779    -0.16843529     2.53629392
      H     4.82798612     1.69372740     0.34850597
      H     5.19819031    -0.33166685    -0.88995078
      O     1.92408181     0.21236895    -1.36944991
      O     2.00586258    -0.59099484     2.20591912
      O     3.40013384    -1.40992667    -2.13761992
      O     4.46983244     1.56333772    -0.53749905
      O     4.63391164     0.18869938     1.68384712`,
  });
  const calculationId = createCalculation({
    geometryIds: [geometryId],
    parameters: {
      type: 'groundState',
      method: 'machineLearning',
      network: 'tensormol01',
      program: 'tensormol',
      calculate: ['energy', 'force'],
    },
    userId,
  });

  return {
    calculationId,
    clusterId,
    geometryId,
    serverId,
    userId,
  };
};

export { createTestData };
export default { createTestData };
