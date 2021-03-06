from TensorMol import GeomOptimizer, Mol, PARAMS


def main(manager, molecule, emit_callback=None):
    """main."""
    if (hasattr(manager, 'get_energy_force_function')):
        energy_force_function = manager.get_energy_force_function(molecule)
    else:

        def energy_force_function(x_, do_force=True):
            """Calculate energy and force."""
            print(x_)
            mtmp = Mol(molecule.atoms, x_)
            (Etotal, Ebp, Ebp_atom, Ecc, Evdw, mol_dipole, atom_charge,
             gradient) = manager.EvalBPDirectEEUpdateSingle(
                 mtmp, PARAMS["AN1_r_Rc"], PARAMS["AN1_a_Rc"],
                 PARAMS["EECutoffOff"], True)
            energy = Etotal[0]
            force = gradient[0]
            if do_force:
                return energy, force
            else:
                return energy

    # Perform geometry optimization
    PARAMS["OptMaxCycles"] = 100 + (len(molecule.atoms) / 100) * 300
    PARAMS["OptThresh"] = 0.001
    Opt = GeomOptimizer(energy_force_function)
    molecule = Opt.Opt(molecule, callback=emit_callback)
    return molecule


if __name__ == "__main__":
    import os
    import sys
    sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
    from networks import tensormol01, tensormol02, ani1
    molecule = Mol()
    molecule.FromXYZString("""12
        benzene
        C     0.00000     1.40272      0
        H     0.00000     2.49029      0
        C    -1.21479     0.70136      0
        H    -2.15666     1.24515      0
        C    -1.21479    -0.70136      0
        H    -2.15666    -1.24515      0
        C     0.00000    -1.40272      0
        H     0.00000    -2.49029      0
        C     1.21479    -0.70136      0
        H     2.15666    -1.24515      0
        C     1.21479     0.70136      0
        H     2.15666     1.24515      0""")
    print(main(tensormol01.main(), molecule))
    print(main(ani1.main(), molecule))
    print(main(tensormol02.main(), molecule))
