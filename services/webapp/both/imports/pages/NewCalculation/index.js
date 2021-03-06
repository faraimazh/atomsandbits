import React from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  withState,
  withHandlers,
  onlyUpdateForPropTypes,
  lifecycle,
} from 'recompose';
import { Helmet } from 'react-helmet';
import { Meteor } from 'meteor/meteor';
import map from 'lodash/map';
import throttle from 'lodash/throttle';
import uniq from 'lodash/uniq';

import { logger } from '/both/imports/logger';
import Molecule from '/both/imports/tools/Molecule';
import CalculationOptions from '/both/imports/components/CalculationOptions';
import AppLayout from '/both/imports/components/AppLayout';
import MoleculeRenderer from '/both/imports/components/MoleculeRenderer';

import { withRunCalculationMutation } from './withRunCalculationMutation';
import { NewCalculationContainer, StartButton } from './styles';

let Session;
if (Meteor.isClient) {
  Session = require('meteor/session').Session;
} else {
  let sessionVariables = {};
  Session = {
    set: (key, value) => (sessionVariables[key] = value),
    get: (key) => sessionVariables[key],
  };
}

if (!Session.get('xyz')) {
  Session.set(
    'xyz',
    new Molecule({
      xyz: `
        12
        benzene
        C        0.00000        1.40272        0.00000
        H        0.00000        2.49029        0.00000
        C       -1.21479        0.70136        0.00000
        H       -2.15666        1.24515        0.00000
        C       -1.21479       -0.70136        0.00000
        H       -2.15666       -1.24515        0.00000
        C        0.00000       -1.40272        0.00000
        H        0.00000       -2.49029        0.00000
        C        1.21479       -0.70136        0.00000
        H        2.15666       -1.24515        0.00000
        C        1.21479        0.70136        0.00000
        H        2.15666        1.24515        0.00000
  `,
    }).prettify().xyz
  );
}
if (!Session.get('parameters')) {
  // Default Parameters
  Session.set('parameters', {
    type: 'geometryOptimization',
    method: 'machineLearning',
    network: 'tensormol02',
  });
}

const inputTypes = ['geometry'];

const enhance = compose(
  withRunCalculationMutation,
  withState('xyz', 'setXyz', () => Session.get('xyz')),
  withState('parameters', 'setParameters', () => Session.get('parameters')),
  withHandlers({
    submitCalculation: ({ xyz, parameters, runCalculationMutation }) =>
      throttle(() => {
        // Create client-side checks system here
        // ----------
        const submit = () => {
          const {
            atomCollection,
            atomicCoords,
            molecularFormula,
          } = new Molecule({
            xyz: xyz,
          });
          if (atomCollection.length === 0) {
            window.alert('No elements in xyz.');
            return;
          }
          if (atomCollection.length > 1000) {
            window.alert('Maximum of 1000 atoms for now.');
            return;
          }
          if (parameters.atomOne && parameters.atomOne === parameters.atomTwo) {
            window.alert('Atom1 cannot equal Atom2.');
            return;
          }
          if (parameters.type === 'nudgedElasticBand') {
            const { secondaryXyz } = parameters;
            const secondaryMolecule = new Molecule({
              xyz: secondaryXyz,
            });
            const secondaryMolecularFormula =
              secondaryMolecule.molecularFormula;
            const secondaryAtomicCoords = secondaryMolecule.atomicCoords;
            if (molecularFormula !== secondaryMolecularFormula) {
              window.alert('Molecular Formulas must be the same for NEB.');
              return;
            }
            if (molecularFormula !== secondaryMolecularFormula) {
              window.alert('Molecular Formulas must be the same for NEB.');
              return;
            }
            if (atomicCoords === secondaryAtomicCoords) {
              window.alert('Coordinates cannot be the same.');
              return;
            }
          }
          if (parameters.method === 'machineLearning') {
            let elements = uniq(
              map(atomCollection, (atomDocument) => atomDocument.element)
            );
            import { networks } from '/both/imports/components/CalculationOptions/options';
            import find from 'lodash/find';
            let supportedElements = find(networks, {
              value: parameters.network,
            }).supportedElements;
            let unsupportedElementFound = false;
            elements.forEach((element) => {
              if (supportedElements.indexOf(element) === -1) {
                window.alert(
                  `Only ${supportedElements.join(
                    ', '
                  )} elements are supported for this network.`
                );
                unsupportedElementFound = true;
              }
            });
            if (unsupportedElementFound) return;
          }
          const input = {
            xyzs: [xyz],
            parameters: parameters,
          };
          if (parameters.secondaryXyz) {
            input.xyzs.push(parameters.secondaryXyz);
            delete input.parameters.secondaryXyz;
          }
          logger.info('Submitting Calculation', input);
          runCalculationMutation({
            input,
          });
        };
        if (!Meteor.userId()) {
          Meteor.loginWithGoogle({}, (err) => {
            if (err) {
              // Login Error
            } else {
              // Successful Login
              submit();
            }
          });
        } else {
          submit();
        }
      }, 5000),
  }),
  lifecycle({
    componentDidUpdate() {
      const { xyz, parameters } = this.props;
      Session.set('xyz', xyz);
      Session.set('parameters', parameters);
    },
    componentWillUnmount() {
      const { xyz, parameters } = this.props;
      Session.set('xyz', xyz);
      Session.set('parameters', parameters);
    },
  }),
  onlyUpdateForPropTypes
);

const NewCalculationPure = ({
  parameters,
  setParameters,
  setXyz,
  submitCalculation,
  xyz,
}) => (
  <AppLayout
    mobileOnlyToolbar
    title="New Calculation"
    appContent={
      <NewCalculationContainer>
        <Helmet>
          <title>new calculation | atoms+bits</title>
          <meta
            name="description"
            content="run a molecular simulation on atoms+bits"
          />
        </Helmet>
        <MoleculeRenderer setXyz={setXyz} xyz={xyz} />
        <div style={{ height: 30 }} />
        <CalculationOptions
          parameters={parameters}
          inputTypes={inputTypes}
          setParameters={setParameters}
        />
        <StartButton
          variant="raised"
          color="primary"
          onClick={submitCalculation}
        >
          Start
        </StartButton>
      </NewCalculationContainer>
    }
  />
);
NewCalculationPure.propTypes = {
  parameters: PropTypes.object.isRequired,
  setParameters: PropTypes.func.isRequired,
  setXyz: PropTypes.func.isRequired,
  submitCalculation: PropTypes.func.isRequired,
  xyz: PropTypes.string.isRequired,
};

const NewCalculation = enhance(NewCalculationPure);

export { NewCalculation };
export default NewCalculation;
