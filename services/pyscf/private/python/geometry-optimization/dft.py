# -----------------------
#     Argument Parser
# -----------------------
import sys, argparse

parser = argparse.ArgumentParser()
parser.add_argument('--atomic-coords', help='atomic coordinates')
parser.add_argument('--density-fit', help='density fitting method')
parser.add_argument('--basis-set', help='basis set')
parser.add_argument('--aux-basis-set', help='auxiliary basis set')
parser.add_argument('--pseudo-potential', help='pseudo potential')
parser.add_argument('--functional', help='dft functional')
parser.add_argument('--charge', help='charge')
parser.add_argument('--multiplicity', help='multiplicity')
parser.add_argument('--k-points', help='k-points [3x1]')
parser.add_argument('--lattice-vectors', help='lattice vectors [3x3]')
parser.add_argument('--frozen-cores', help='number of frozen cores')
results, remaining = parser.parse_known_args()

atomic_coords    = results.atomic_coords.replace('\\n', '\n')
density_fit      = results.density_fit.upper() if results.density_fit != 'undefined' else None
basis_set        = results.basis_set
aux_basis_set    = results.aux_basis_set if results.aux_basis_set != 'undefined' else None
pseudo_potential = results.pseudo_potential if results.pseudo_potential != 'undefined' else None
functional       = results.functional
charge           = int(results.charge) if results.charge is not None else 0
multiplicity     = int(results.multiplicity) if results.multiplicity is not None else 1
spin             = (multiplicity - 1)/2
num_frozen_cores = int(results.frozen_cores) if results.frozen_cores is not None else 0

sys.argv = [sys.argv[0]]

# -----------------------
#     PYSCF
# -----------------------
from pyscf import gto, dft
from pyscf.geomopt import berny_solver

mol = gto.M(atom=atomic_coords, basis=basis_set, spin=spin, charge=charge, verbose=4)

my_dft  = dft.RKS(mol)
my_dft.conv_tol = 1e-4
my_dft.max_cycle = 100
my_dft.xc = functional
if density_fit:
    my_dft = my_dft.density_fit()
    my_dft.with_df.auxbasis = aux_basis_set

new_mol = berny_solver.optimize(my_dft, assert_convergence=True)
print("New geometry (unit A)")
for atom_index, atomic_coord in enumerate(new_mol.atom):
    print("{:4} {:s} {:18.12f} {:16.12f} {:16.12f}".format(atom_index, atomic_coord[0], atomic_coord[1][0], atomic_coord[1][1], atomic_coord[1][2]))