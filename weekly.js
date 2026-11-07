/* Weekly tests, taken inside the app with the student's own sign-in.
   Results go to Firestore results/{testId}/entries/{uid}; each student's best attempt is kept for the rank list.
   To add a test, append to WEEKLY with a new id. */
(()=>{
const R = String.raw;
const Q = [
  /* ---------- Section A: MCQ ---------- */
  { t:"mcq", q:R`The number of elements of order \(10\) in the group \(\Z_{30}\times\Z_{20}\) is`,
    o:[R`\(24\)`,R`\(48\)`,R`\(72\)`,R`\(96\)`], a:2,
    s:R`Let \(N(d)\) be the number of pairs whose order divides \(d\); in \(\Z_n\) there are \(\gcd(d,n)\) such elements. \(N(10)=10\cdot10,\ N(5)=5\cdot5,\ N(2)=2\cdot2,\ N(1)=1\). Order exactly \(10\): \(100-25-4+1=72\).` },
  { t:"mcq", q:R`Let \(p\) be a prime and \(G\) a non-abelian group of order \(p^3\). Then \(|Z(G)|\) equals`,
    o:[R`\(1\)`,R`\(p\)`,R`\(p^2\)`,R`\(p^3\)`], a:1,
    s:R`A \(p\)-group has non-trivial centre. \(|Z(G)|=p^3\) means \(G\) abelian; \(|Z(G)|=p^2\) makes \(G/Z(G)\) cyclic, again forcing \(G\) abelian. Hence \(|Z(G)|=p\).` },
  { t:"mcq", q:R`The number of group homomorphisms from \(S_3\) to \(S_3\) is`,
    o:[R`\(4\)`,R`\(6\)`,R`\(9\)`,R`\(10\)`], a:3,
    s:R`Classify by kernel. Kernel \(\{e\}\): automorphisms, \(|\operatorname{Aut}S_3|=6\). Kernel \(A_3\): image is a subgroup of order \(2\), and \(S_3\) has \(3\) of them. Kernel \(S_3\): the trivial map. Total \(6+3+1=10\).` },
  { t:"mcq", q:R`Let \(G=\Q/\Z\) and let \(n\) be a positive integer. Then \(G\) has a cyclic subgroup of order \(n\):`,
    o:[R`not necessarily`,R`yes, and it is the unique subgroup of \(G\) of order \(n\)`,R`yes, but it need not be unique`,R`never, since \(G\) is infinite`], a:1,
    s:R`\(\tfrac1n+\Z\) has order \(n\). Any element \(x\) of order dividing \(n\) satisfies \(nx\in\Z\), so \(x\in\langle \tfrac1n+\Z\rangle\). The subgroup \(\left\{\tfrac kn+\Z\right\}\) is therefore the only one of order \(n\).` },
  { t:"mcq", q:R`The number of distinct subgroups of the cyclic group \(\Z_{50000}\) is`,
    o:[R`\(30\)`,R`\(20\)`,R`\(25\)`,R`\(36\)`], a:0,
    s:R`A cyclic group of order \(n\) has exactly one subgroup for each divisor of \(n\). \(50000=2^4\cdot5^5\), so \(\tau(n)=(4+1)(5+1)=30\).` },
  { t:"mcq", q:R`The number of elements of order \(6\) in the symmetric group \(S_6\) is`,
    o:[R`\(240\)`,R`\(120\)`,R`\(200\)`,R`\(360\)`], a:0,
    s:R`Cycle types with lcm \(6\) on \(6\) points: a \(6\)-cycle, \(5!=120\); and type \((3)(2)(1)\), \(\binom63\cdot2\cdot\binom32=120\). Total \(240\).` },
  { t:"mcq", q:R`The number of elements of order \(2\) in the group \(U(1000)\) is`,
    o:[R`\(1\)`,R`\(3\)`,R`\(7\)`,R`\(15\)`], a:2,
    s:R`\(U(1000)\cong U(8)\times U(125)\cong(\Z_2\times\Z_2)\times\Z_{100}\). Elements with \(x^2=e\): \(4\cdot2=8\). Removing the identity leaves \(7\).` },
  { t:"mcq", q:R`The number of distinct subgroups of \(\Z_4\times\Z_2\) is`,
    o:[R`\(5\)`,R`\(6\)`,R`\(7\)`,R`\(8\)`], a:3,
    s:R`Order \(1\): \(1\). Order \(2\): one per element of order \(2\), namely \((2,0),(0,1),(2,1)\), giving \(3\). Order \(4\): cyclic \(\langle(1,0)\rangle,\langle(1,1)\rangle\) and the Klein group \(\{(0,0),(2,0),(0,1),(2,1)\}\), giving \(3\). Order \(8\): \(1\). Total \(8\).` },
  { t:"mcq", q:R`The remainder when \(3^{2026}\) is divided by \(100\) is`,
    o:[R`\(9\)`,R`\(29\)`,R`\(49\)`,R`\(69\)`], a:1,
    s:R`The exponent of \(U(100)\cong\Z_2\times\Z_{20}\) is \(20\), so \(3^{20}\equiv1\pmod{100}\). Since \(2026\equiv6\pmod{20}\), \(3^{2026}\equiv3^6=729\equiv29\).` },
  { t:"mcq", q:R`Let \(S\) be the set of positive divisors of \(10^{55}\). The number of elements of \(S\) that are multiples of \(10^{44}\) is`,
    o:[R`\(11\)`,R`\(12\)`,R`\(121\)`,R`\(144\)`], a:3,
    s:R`Divisors are \(2^a5^b\) with \(0\le a,b\le55\). Multiples of \(10^{44}\) need \(44\le a,b\le55\): \(12\) choices each, so \(12^2=144\).` },

  /* ---------- Section B: MSQ ---------- */
  { t:"msq", q:R`In \(S_4\), let \(H=\{e,(1\,2)(3\,4)\}\) and \(K=\{e,(1\,2)(3\,4),(1\,3)(2\,4),(1\,4)(2\,3)\}\). Which of the following are true?`,
    o:[R`\(K\) is normal in \(S_4\)`,R`\(H\) is normal in \(K\), but \(H\) is not normal in \(A_4\)`,R`\(A_4\) has a subgroup of order \(6\)`,R`\(S_4/K\cong S_3\)`], a:[0,1,3],
    s:R`(A) \(K\) is a union of conjugacy classes. (B) \(K\) is abelian, so \(H\trianglelefteq K\); conjugating \((1\,2)(3\,4)\) by \((1\,2\,3)\in A_4\) gives \((2\,3)(1\,4)\notin H\). (C) False: the classic counterexample to the converse of Lagrange. (D) \(S_4/K\) has order \(6\) and is non-abelian, so it is \(S_3\).` },
  { t:"msq", q:R`Let \(G=\Z_{10}\times\Z_{15}\). Which of the following are true?`,
    o:[R`\(G\) has exactly one element of order \(2\)`,R`\(G\cong\Z_{150}\)`,R`\(G\) has exactly \(24\) elements of order \(5\)`,R`\(G\) has exactly \(24\) elements of order \(10\)`], a:[0,2,3],
    s:R`\(G\cong\Z_2\times\Z_3\times(\Z_5\times\Z_5)\). (A) The Sylow \(2\)-subgroup is \(\Z_2\). (B) False, since \(\gcd(10,15)\ne1\). (C) \(\Z_5\times\Z_5\) has \(25-1=24\) elements of order \(5\). (D) Order \(10\) means \(2\)-part of order \(2\) (one choice) and \(5\)-part of order \(5\) (\(24\) choices), \(3\)-part trivial: \(24\).` },
  { t:"msq", q:R`Let \(G=S_3\times S_3\). Which of the following are true?`,
    o:[R`\(A_3\times A_3\) is a normal subgroup of \(G\)`,R`The centre \(Z(G)\) is trivial`,R`\(G\) has a normal subgroup of order \(18\)`,R`Every subgroup of \(G\) of order \(4\) is normal in \(G\)`], a:[0,1,2],
    s:R`(A) A product of normal subgroups is normal. (B) \(Z(G)=Z(S_3)\times Z(S_3)\) is trivial. (C) \(S_3\times A_3\) has index \(2\). (D) False: subgroups of order \(4\) are Sylow \(2\)-subgroups \(\langle\tau\rangle\times\langle\sigma\rangle\), and there are \(3\cdot3=9\) of them, so none is normal.` },
  { t:"msq", q:R`On a group \(G\) define \(a\sim b \iff b=gag^{-1}\) for some \(g\in G\). Which of the following are true?`,
    o:[R`\(\sim\) is an equivalence relation on \(G\)`,R`The equivalence class of the identity \(e\) is \(\{e\}\)`,R`For \(G=S_4\), the number of equivalence classes is \(5\)`,R`Every equivalence class is a subgroup of \(G\)`], a:[0,1,2],
    s:R`(A) Conjugacy is reflexive, symmetric and transitive. (B) \(geg^{-1}=e\). (C) Classes of \(S_4\) correspond to cycle types, i.e. the \(5\) partitions of \(4\). (D) False: a class other than \(\{e\}\) does not contain \(e\).` },
  { t:"msq", q:R`Which of the following groups are cyclic?`,
    o:[R`\(U(162)\)`,R`\(U(1000)\)`,R`\(\Z_{10}\times\Z_{21}\)`,R`The multiplicative group \(\F_{27}^{\,*}\) of the field with \(27\) elements`], a:[0,2,3],
    s:R`\(U(n)\) is cyclic exactly for \(n=1,2,4,p^k,2p^k\) with \(p\) an odd prime. (A) \(162=2\cdot3^4\): cyclic. (B) \(8\mid1000\): not cyclic. (C) \(\gcd(10,21)=1\), so it is \(\Z_{210}\). (D) The multiplicative group of a finite field is always cyclic.` }
];

/* Weekly Test 2: classes of 12-16 Oct 2026 (3 MCQ + 3 MSQ from each class day) */
const Q2 = [
  /* ---------- Section A: MCQ ---------- */
  // 12 Oct · Group Theory IV: cosets, normal subgroups, quotient groups
  { t:"mcq", q:R`The number of normal subgroups of the symmetric group \(S_4\) is`,
    o:[R`\(3\)`,R`\(4\)`,R`\(5\)`,R`\(6\)`], a:1,
    s:R`A normal subgroup is a union of conjugacy classes containing \(e\), of order dividing \(24\). Class sizes in \(S_4\): \(1,3,6,8,6\). The possible unions are \(\{e\}\) (\(1\)), \(V_4=\{e\}\cup\{\text{double transpositions}\}\) (\(4\)), \(A_4\) (\(1+3+8=12\)) and \(S_4\). So \(4\).` },
  { t:"mcq", q:R`The quotient group \((\Z_4\times\Z_8)/\langle(1,2)\rangle\) is isomorphic to`,
    o:[R`\(\Z_8\)`,R`\(\Z_4\times\Z_2\)`,R`\(\Z_2\times\Z_2\times\Z_2\)`,R`\(Q_8\)`], a:0,
    s:R`\(H=\langle(1,2)\rangle\) has order \(\operatorname{lcm}(4,4)=4\), so the quotient has order \(8\) and is abelian. For \((0,1)+H\): \((0,k)\in H\) means \((0,k)=(m,2m)\) with \(m\equiv0\pmod4\), so \(k=2m\equiv0\pmod8\). Hence \((0,1)+H\) has order \(8\) and the quotient is cyclic.` },
  { t:"mcq", q:R`The number of subgroups of index \(2\) in \(\Z_2\times\Z_4\times\Z_6\) is`,
    o:[R`\(3\)`,R`\(5\)`,R`\(7\)`,R`\(8\)`], a:2,
    s:R`Subgroups of index \(2\) are kernels of onto homomorphisms \(G\to\Z_2\), and distinct onto maps to \(\Z_2\) have distinct kernels. \(\operatorname{Hom}(G,\Z_2)\cong\Z_2^3\) (one \(\Z_2\) for each even cyclic factor), so there are \(2^3-1=7\).` },
  // 13 Oct · Group Theory V & VI: homomorphisms, isomorphisms, permutation groups
  { t:"mcq", q:R`The number of group homomorphisms from \(S_3\) to \(\Z_6\) is`,
    o:[R`\(1\)`,R`\(2\)`,R`\(3\)`,R`\(6\)`], a:1,
    s:R`The image is abelian, so the map factors through \(S_3/[S_3,S_3]=S_3/A_3\cong\Z_2\). Homomorphisms \(\Z_2\to\Z_6\) send the generator to an element of order dividing \(2\): \(0\) or \(3\). So \(2\).` },
  { t:"mcq", q:R`The number of one-one homomorphisms from \(\Z_6\) into \(S_5\) is`,
    o:[R`\(10\)`,R`\(20\)`,R`\(30\)`,R`\(40\)`], a:1,
    s:R`A one-one map is fixed by the image of \(1\), which must have order exactly \(6\). In \(S_5\) these are the products of a \(3\)-cycle and a disjoint transposition: \(\binom53\cdot2\cdot1=20\).` },
  { t:"mcq", q:R`The order of \(\operatorname{Aut}(\Z_2\times\Z_2\times\Z_2)\) is`,
    o:[R`\(24\)`,R`\(48\)`,R`\(168\)`,R`\(336\)`], a:2,
    s:R`\(\Z_2^3\) is a vector space over \(\F_2\), and its automorphisms are the invertible linear maps: \(|GL_3(\F_2)|=(8-1)(8-2)(8-4)=168\).` },
  // 14 Oct · Group Theory VII & VIII: dihedral, Klein, Q8, Sylow
  { t:"mcq", q:R`The number of elements of order \(2\) in the dihedral group \(D_6\) of order \(12\) is`,
    o:[R`\(5\)`,R`\(6\)`,R`\(7\)`,R`\(8\)`], a:2,
    s:R`All \(6\) reflections have order \(2\), and among the rotations \(r^k\) (\(r^6=e\)) only \(r^3\) does. Total \(7\).` },
  { t:"mcq", q:R`The number of Sylow \(3\)-subgroups of \(S_5\) is`,
    o:[R`\(1\)`,R`\(4\)`,R`\(6\)`,R`\(10\)`], a:3,
    s:R`A Sylow \(3\)-subgroup has order \(3\) and is generated by a \(3\)-cycle. There are \(\binom53\cdot2=20\) three-cycles, two in each subgroup, giving \(10\). Check: \(10\equiv1\pmod3\) and \(10\mid40\).` },
  { t:"mcq", q:R`Let \(G\) be a simple group of order \(168\). The number of elements of order \(7\) in \(G\) is`,
    o:[R`\(6\)`,R`\(42\)`,R`\(48\)`,R`\(56\)`], a:2,
    s:R`\(n_7\equiv1\pmod7\) and \(n_7\mid24\), so \(n_7\in\{1,8\}\). Simplicity rules out \(1\), so \(n_7=8\). Distinct subgroups of prime order meet trivially, so the count is \(8\cdot6=48\).` },
  // 15 Oct · Ring Theory I & II: rings, units, zero divisors, integral domains
  { t:"mcq", q:R`The number of idempotent matrices (\(A^2=A\)) in the ring \(M_2(\Z_2)\) is`,
    o:[R`\(2\)`,R`\(4\)`,R`\(6\)`,R`\(8\)`], a:3,
    s:R`Besides \(0\) and \(I\), an idempotent has rank \(1\) and is fixed by its image and kernel, two distinct lines of \(\F_2^2\) with image \(\oplus\) kernel \(=\F_2^2\). There are \(3\) lines, so \(3\cdot2=6\) ordered pairs. Total \(2+6=8\).` },
  { t:"mcq", q:R`The number of nilpotent matrices in the ring \(M_2(\Z_2)\) is`,
    o:[R`\(2\)`,R`\(3\)`,R`\(4\)`,R`\(6\)`], a:2,
    s:R`A \(2\times2\) nilpotent matrix satisfies \(A^2=0\), i.e. trace \(0\) and det \(0\): \(A=\begin{pmatrix}a&b\\c&a\end{pmatrix}\) with \(a^2=bc\) over \(\Z_2\). \(a=0\): \(bc=0\), \(3\) choices; \(a=1\): \(b=c=1\), \(1\) choice. Total \(4\).` },
  { t:"mcq", q:R`The number of units in the ring \(M_2(\Z_6)\) is`,
    o:[R`\(96\)`,R`\(144\)`,R`\(288\)`,R`\(576\)`], a:2,
    s:R`\(M_2(\Z_6)\cong M_2(\Z_2)\times M_2(\Z_3)\) by CRT, so the units are \(GL_2(\Z_2)\times GL_2(\Z_3)\): \(6\cdot48=288\), since \(|GL_2(\Z_3)|=(9-1)(9-3)=48\).` },
  // 16 Oct · Ring Theory III: ideals, quotient rings, ring homomorphisms
  { t:"mcq", q:R`The number of ideals of the ring \(\Z_{12}\times\Z_9\) is`,
    o:[R`\(9\)`,R`\(12\)`,R`\(18\)`,R`\(24\)`], a:2,
    s:R`In a product of rings with \(1\), every ideal is \(I\times J\). \(\Z_{12}\) has \(\tau(12)=6\) ideals and \(\Z_9\) has \(\tau(9)=3\), giving \(18\).` },
  { t:"mcq", q:R`The number of maximal ideals of \(\Z_{30}\times\Z_4\) is`,
    o:[R`\(3\)`,R`\(4\)`,R`\(5\)`,R`\(6\)`], a:1,
    s:R`Maximal ideals of \(R_1\times R_2\) are \(M\times R_2\) or \(R_1\times M\) with \(M\) maximal. \(\Z_{30}\) has \(3\) (\(\langle2\rangle,\langle3\rangle,\langle5\rangle\)) and \(\Z_4\) has \(1\) (\(\langle2\rangle\)). Total \(4\).` },
  { t:"mcq", q:R`The number of ring homomorphisms (not necessarily unital) from \(\Z_{20}\) to \(\Z_{30}\) is`,
    o:[R`\(2\)`,R`\(4\)`,R`\(6\)`,R`\(8\)`], a:1,
    s:R`\(e=f(1)\) must satisfy \(e^2=e\) and \(20e=0\) in \(\Z_{30}\). The idempotents of \(\Z_{30}\) are \(0,1,6,10,15,16,21,25\), and \(20e\equiv0\pmod{30}\iff3\mid e\). That leaves \(0,6,15,21\): \(4\).` },

  /* ---------- Section B: MSQ ---------- */
  // 12 Oct
  { t:"msq", q:R`Which of the following are true?`,
    o:[R`Every subgroup of index \(2\) is normal`,R`If \(H\trianglelefteq K\) and \(K\trianglelefteq G\), then \(H\trianglelefteq G\)`,R`The centre of \(S_n\) is trivial for \(n\ge3\)`,R`\(A_n\) is the only subgroup of index \(2\) in \(S_n\) (\(n\ge2\))`], a:[0,2,3],
    s:R`(A) True: the left and right cosets are both \(H\) and \(G\setminus H\). (B) False: in \(D_4\), \(\langle s\rangle\trianglelefteq\{e,r^2,s,r^2s\}\trianglelefteq D_4\), but \(\langle s\rangle\) is not normal in \(D_4\). (C) True. (D) True: an index-\(2\) subgroup is normal and contains all squares, hence all \(3\)-cycles, which generate \(A_n\).` },
  { t:"msq", q:R`For the quaternion group \(Q_8\), which of the following are true?`,
    o:[R`Every subgroup of \(Q_8\) is normal`,R`\(Q_8/Z(Q_8)\cong\Z_4\)`,R`\(Q_8\) has exactly one element of order \(2\)`,R`\(Q_8\cong D_4\)`], a:[0,2],
    s:R`(A) True: the subgroups are \(\{1\},\{\pm1\},\langle i\rangle,\langle j\rangle,\langle k\rangle,Q_8\); each has index \(\le2\) or is central. (B) False: if \(G/Z(G)\) is cyclic then \(G\) is abelian; here \(Q_8/\{\pm1\}\cong V_4\). (C) True: only \(-1\). (D) False: \(D_4\) has \(5\) elements of order \(2\).` },
  { t:"msq", q:R`Let \(H=\langle(1\,2\,3)\rangle\le A_4\). Which of the following are true?`,
    o:[R`\(H\) is normal in \(A_4\)`,R`\(H\) has exactly \(4\) left cosets in \(A_4\)`,R`\(A_4\) has no subgroup of order \(6\)`,R`The normaliser of \(H\) in \(A_4\) is \(H\) itself`], a:[1,2,3],
    s:R`(A) False: \(A_4\) has \(4\) Sylow \(3\)-subgroups. (B) True: \([A_4:H]=12/3=4\). (C) True: a subgroup of order \(6\) would have index \(2\), so it would contain all \(8\) three-cycles (squares), which is impossible. (D) True: \(n_3=[A_4:N(H)]=4\), so \(|N(H)|=3\).` },
  // 13 Oct
  { t:"msq", q:R`Which of the following are true?`,
    o:[R`\(\Z_6\cong S_3\)`,R`\(\operatorname{Aut}(\Z_8)\cong\Z_2\times\Z_2\)`,R`\(\operatorname{Aut}(\Z_n)\) is cyclic for every \(n\ge1\)`,R`\(\operatorname{Inn}(S_3)\cong S_3\)`], a:[1,3],
    s:R`(A) False: \(S_3\) is non-abelian. (B) True: \(\operatorname{Aut}(\Z_8)\cong U(8)=\{1,3,5,7\}\), every element of order \(\le2\). (C) False: (B) is a counterexample. (D) True: \(\operatorname{Inn}(G)\cong G/Z(G)\) and \(Z(S_3)\) is trivial.` },
  { t:"msq", q:R`Which of the following are true?`,
    o:[R`\(S_n\) is generated by \((1\,2)\) and \((1\,2\,\cdots\,n)\)`,R`For \(n\ge3\), every element of \(A_n\) is a product of \(3\)-cycles`,R`\(S_4\) has a normal subgroup of order \(4\)`,R`\(S_5\) has a normal subgroup of order \(12\)`], a:[0,1,2],
    s:R`(A) True: conjugating \((1\,2)\) by powers of the \(n\)-cycle gives all \((i\ i{+}1)\), which generate \(S_n\). (B) True: \((a\,b)(a\,c)=(a\,c\,b)\) and \((a\,b)(c\,d)=(a\,c\,b)(a\,c\,d)\). (C) True: \(V_4\). (D) False: the normal subgroups of \(S_5\) are \(\{e\},A_5,S_5\).` },
  { t:"msq", q:R`Which of the following homomorphisms exist?`,
    o:[R`An onto homomorphism \(\Z_{24}\to\Z_8\)`,R`An onto homomorphism \(S_4\to S_3\)`,R`An onto homomorphism \(\Z\to\Z_2\times\Z_2\)`,R`A non-trivial homomorphism \(A_5\to\Z_5\)`], a:[0,1],
    s:R`(A) Yes: reduction mod \(8\), since \(8\mid24\). (B) Yes: \(S_4/V_4\cong S_3\). (C) No: a quotient of \(\Z\) is cyclic, but \(\Z_2\times\Z_2\) is not. (D) No: \(A_5\) is simple and non-abelian, so the kernel would be \(A_5\).` },
  // 14 Oct
  { t:"msq", q:R`Which of the following are true?`,
    o:[R`Every group of order \(35\) is cyclic`,R`Every group of order \(30\) has a normal subgroup of order \(15\)`,R`No group of order \(56\) is simple`,R`Every group of order \(12\) has a normal Sylow \(3\)-subgroup`], a:[0,1,2],
    s:R`(A) True: \(n_5=n_7=1\), so \(G\cong\Z_5\times\Z_7\). (B) True: if \(n_3=10\) and \(n_5=6\), there would be \(20+24>30\) elements; so one is normal, \(P_3P_5\) is a subgroup of order \(15\), of index \(2\). (C) True: if \(n_7=8\), the \(48\) elements of order \(7\) leave room for only one Sylow \(2\)-subgroup. (D) False: \(A_4\) has \(n_3=4\).` },
  { t:"msq", q:R`For the dihedral group \(D_4\) of order \(8\), which of the following are true?`,
    o:[R`\(|Z(D_4)|=2\)`,R`\(D_4\) has exactly \(5\) elements of order \(2\)`,R`\(D_4\) has a subgroup isomorphic to the Klein group \(V_4\)`,R`Every subgroup of \(D_4\) is normal`], a:[0,1,2],
    s:R`(A) True: \(Z(D_4)=\{e,r^2\}\). (B) True: \(r^2\) and the \(4\) reflections. (C) True: \(\{e,r^2,s,r^2s\}\). (D) False: \(\langle s\rangle\) is not normal, since \(rsr^{-1}=r^2s\).` },
  { t:"msq", q:R`Which of the following groups have a normal Sylow \(2\)-subgroup?`,
    o:[R`\(S_4\)`,R`\(D_6\) (order \(12\))`,R`\(A_4\)`,R`\(Q_8\times\Z_3\)`], a:[2,3],
    s:R`(A) No: \(S_4\) has \(3\) Sylow \(2\)-subgroups (copies of \(D_4\)). (B) No: \(D_6\) has \(3\) Sylow \(2\)-subgroups \(\{e,r^3,s r^k,s r^{k+3}\}\). (C) Yes: \(V_4\trianglelefteq A_4\). (D) Yes: \(Q_8\times\{0\}\) is the unique subgroup of order \(8\) (it is all elements of \(2\)-power order).` },
  // 15 Oct
  { t:"msq", q:R`Let \(R\) be a ring with unity. Which of the following are true?`,
    o:[R`If \(ab=1\) then \(ba=1\)`,R`If \(R\) is finite and \(ab=1\), then \(ba=1\)`,R`A non-zero nilpotent element of a commutative ring is a zero divisor`,R`Every Boolean ring is commutative`], a:[1,2,3],
    s:R`(A) False: on sequences, the left shift \(L\) and right shift \(S\) satisfy \(LS=1\ne SL\). (B) True: \(x\mapsto bx\) is one-one (as \(bx=0\Rightarrow abx=x=0\)), hence onto, so \(bc=1\) for some \(c\), and \(c=abc=a\). (C) True: if \(a^n=0\) with \(n\) minimal, then \(a\cdot a^{n-1}=0\) with \(a^{n-1}\ne0\). (D) True: \((a+b)^2=a+b\) gives \(ab+ba=0\), and \(2x=0\), so \(ab=ba\).` },
  { t:"msq", q:R`Which of the following are integral domains?`,
    o:[R`\(\Z[x]\)`,R`\(\Z_6[x]\)`,R`\(\Z[\sqrt{-5}]\)`,R`\(\R[x]/\langle x^2\rangle\)`], a:[0,2],
    s:R`(A) True: a polynomial ring over an integral domain. (B) False: \(2\cdot3=0\). (C) True: a subring of \(\C\). (D) False: \(\bar x\cdot\bar x=0\) with \(\bar x\ne0\).` },
  { t:"msq", q:R`Which of the following subsets of \(M_2(\R)\) are subrings (not necessarily containing \(I\))?`,
    o:[R`Upper triangular matrices`,R`Matrices with determinant \(0\)`,R`\(\left\{\begin{pmatrix}a&0\\0&0\end{pmatrix}:a\in\R\right\}\)`,R`Matrices with trace \(0\)`], a:[0,2],
    s:R`(A) True: closed under subtraction and products. (B) False: \(\begin{pmatrix}1&0\\0&0\end{pmatrix}+\begin{pmatrix}0&0\\0&1\end{pmatrix}=I\). (C) True. (D) False: \(\begin{pmatrix}0&1\\0&0\end{pmatrix}\begin{pmatrix}0&0\\1&0\end{pmatrix}=\begin{pmatrix}1&0\\0&0\end{pmatrix}\) has trace \(1\).` },
  // 16 Oct
  { t:"msq", q:R`Which of the following quotient rings are fields?`,
    o:[R`\(\Z[x]/\langle 3,\ x^2+1\rangle\)`,R`\(\Z[x]/\langle 5,\ x^2+1\rangle\)`,R`\(\Q[x]/\langle x^4+1\rangle\)`,R`\(\R[x]/\langle x^2-2x+2\rangle\)`], a:[0,2,3],
    s:R`(A) True: \(\cong\Z_3[x]/\langle x^2+1\rangle\), and \(x^2+1\) has no root mod \(3\), giving a field of \(9\) elements. (B) False: mod \(5\), \(x^2+1=(x-2)(x+2)\). (C) True: \(x^4+1\) is irreducible over \(\Q\) (apply Eisenstein at \(2\) to \((x+1)^4+1\)). (D) True: the discriminant is \(-4<0\), so it is irreducible over \(\R\) and the quotient is \(\cong\C\).` },
  { t:"msq", q:R`Which of the following are true?`,
    o:[R`\(\Z[x]\) is a principal ideal domain`,R`In \(\Z[x]\), the ideal \(\langle x\rangle\) is prime but not maximal`,R`Every ideal of \(\Z_n\) is principal`,R`\(F[x]\) is a principal ideal domain for every field \(F\)`], a:[1,2,3],
    s:R`(A) False: \(\langle2,x\rangle\) is not principal. (B) True: \(\Z[x]/\langle x\rangle\cong\Z\), an integral domain but not a field. (C) True: ideals of \(\Z_n\) are subgroups of a cyclic group. (D) True: by the division algorithm.` },
  { t:"msq", q:R`Let \(\varphi:\Z[x]\to\Z_5\), \(\varphi(f)=f(2)\bmod5\). Which of the following are true?`,
    o:[R`\(\varphi\) is an onto ring homomorphism`,R`\(\ker\varphi=\langle5,\ x-2\rangle\)`,R`\(\ker\varphi\) is a maximal ideal of \(\Z[x]\)`,R`\(\ker\varphi=\langle x-2\rangle\)`], a:[0,1,2],
    s:R`(A) True: evaluation followed by reduction, and constants already cover \(\Z_5\). (B) True: \(f=(x-2)q+f(2)\), so \(f\in\ker\varphi\iff5\mid f(2)\iff f\in\langle5,x-2\rangle\). (C) True: \(\Z[x]/\ker\varphi\cong\Z_5\), a field. (D) False: \(5\in\ker\varphi\) but \(5\notin\langle x-2\rangle\).` },
];
/* Weekly Test 3: Group Theory, CSIR NET / GATE level (15 MCQ + 10 MSQ) */
const Q3 = [
  /* ---------- Section A: MCQ ---------- */
  { t:"mcq", q:R`The number of elements of order \(4\) in the symmetric group \(S_6\) is`,
    o:[R`\(90\)`,R`\(180\)`,R`\(270\)`,R`\(360\)`], a:1,
    s:R`Cycle types on \(6\) points with lcm \(4\): \((4)(1)(1)\) and \((4)(2)\). Type \((4)(1)(1)\): \(\binom64\cdot3!=90\). Type \((4)(2)\): \(\binom64\cdot3!\cdot1=90\). Total \(180\).` },
  { t:"mcq", q:R`The number of conjugacy classes in the dihedral group \(D_{10}\) of order \(20\) is`,
    o:[R`\(8\)`,R`\(7\)`,R`\(10\)`,R`\(11\)`], a:0,
    s:R`With \(r^{10}=e\): \(\{e\}\), \(\{r^5\}\) (central), and \(\{r^k,r^{-k}\}\) for \(k=1,2,3,4\), giving \(6\) rotation classes. Since \(n=10\) is even, the reflections split into two classes \(\{r^{2j}s\}\) and \(\{r^{2j+1}s\}\). Total \(6+2=8\), i.e. \((n+6)/2\).` },
  { t:"mcq", q:R`The number of Sylow \(2\)-subgroups of \(S_5\) is`,
    o:[R`\(5\)`,R`\(10\)`,R`\(15\)`,R`\(45\)`], a:2,
    s:R`A Sylow \(2\)-subgroup has order \(8\), moves only \(4\) points (an element moving all \(5\) points has order \(5\) or \(6\)), so it is a Sylow \(2\)-subgroup of some \(S_4\le S_5\) fixing one point. Each \(S_4\) has \(3\) of them (\(\cong D_4\)), and there are \(5\) choices of the fixed point: \(5\cdot3=15\). Check: \(15\equiv1\pmod2\) and \(15\mid15\).` },
  { t:"mcq", q:R`The number of group homomorphisms from \(\Z_6\) to \(S_4\) is`,
    o:[R`\(12\)`,R`\(16\)`,R`\(24\)`,R`\(18\)`], a:3,
    s:R`A homomorphism from \(\Z_6\) is fixed by the image \(x\) of \(1\), any \(x\) with \(x^6=e\), i.e. order \(1,2,3\) or \(6\). In \(S_4\): identity \(1\), transpositions \(6\), double transpositions \(3\), \(3\)-cycles \(8\), no element of order \(6\). Total \(18\).` },
  { t:"mcq", q:R`The order of the automorphism group \(\operatorname{Aut}(\Z_2\times\Z_4)\) is`,
    o:[R`\(8\)`,R`\(6\)`,R`\(4\)`,R`\(24\)`], a:0,
    s:R`An automorphism sends the generator \((0,1)\) of order \(4\) to an element of order \(4\): \((0,1),(0,3),(1,1),(1,3)\), \(4\) choices. It sends \((1,0)\) to an element \(y\) of order \(2\) not in the image of \(\langle(0,1)\rangle\), i.e. \(y\ne(0,2)\): \(y\in\{(1,0),(1,2)\}\), \(2\) choices. So \(|\operatorname{Aut}|=8\) (it is \(\cong D_4\)).` },
  { t:"mcq", q:R`The number of non-isomorphic abelian groups of order \(1800\) is`,
    o:[R`\(6\)`,R`\(8\)`,R`\(12\)`,R`\(18\)`], a:2,
    s:R`\(1800=2^3\cdot3^2\cdot5^2\). By the fundamental theorem the count is \(p(3)\,p(2)\,p(2)=3\cdot2\cdot2=12\), where \(p\) is the partition function.` },
  { t:"mcq", q:R`Which of the following can be the class equation of a group of order \(10\)?`,
    o:[R`\(10=1+1+1+2+5\)`,R`\(10=1+1+2+2+2+2\)`,R`\(10=1+2+3+4\)`,R`\(10=1+2+2+5\)`], a:3,
    s:R`The \(1\)'s form \(Z(G)\), whose order divides \(10\), and every class size divides \(10\). (A) \(|Z(G)|=3\nmid10\). (B) \(|Z(G)|=2\) makes \(G/Z(G)\) of order \(5\), cyclic, so \(G\) is abelian and all classes are singletons: contradiction. (C) \(3,4\nmid10\). (D) is the class equation of \(D_5\): \(\{e\},\{r,r^4\},\{r^2,r^3\}\) and the \(5\) reflections.` },
  { t:"mcq", q:R`The number of subgroups of order \(4\) in \(S_4\) is`,
    o:[R`\(4\)`,R`\(7\)`,R`\(6\)`,R`\(9\)`], a:1,
    s:R`Cyclic: each is generated by a \(4\)-cycle and contains two of them, so \(6/2=3\). Klein: the normal \(V_4=\{e,(12)(34),(13)(24),(14)(23)\}\), and \(\{e,(12),(34),(12)(34)\}\)-type, one for each of the \(3\) splittings of \(\{1,2,3,4\}\) into pairs, giving \(3\). Total \(3+1+3=7\).` },
  { t:"mcq", q:R`The smallest \(n\) for which the alternating group \(A_n\) contains an element of order \(30\) is`,
    o:[R`\(10\)`,R`\(11\)`,R`\(12\)`,R`\(13\)`], a:2,
    s:R`We need disjoint cycles with lcm \(30\) and an even number of even-length cycles. The cheapest lcm-\(30\) types are \(2+3+5=10\) (odd: one transposition), \(6+5=11\) (odd: one \(6\)-cycle), \(10+3=13\). Adding a second transposition fixes the parity: \((2)(2)(3)(5)\) on \(12\) points is even with order \(30\). Nothing of sum \(\le11\) works, so \(n=12\).` },
  { t:"mcq", q:R`The maximum possible order of an element of \(S_{10}\) is`,
    o:[R`\(30\)`,R`\(24\)`,R`\(21\)`,R`\(35\)`], a:0,
    s:R`We maximise \(\operatorname{lcm}\) of a partition of \(10\). \(2+3+5\) gives \(30\); \(7+3\) gives \(21\); \(4+5+1\) gives \(20\); \(5+7=12>10\) so \(35\) is impossible; \(24=8\cdot3\) needs \(8+3=11\) points. So the maximum is \(30\) (Landau's function \(g(10)=30\)).` },
  { t:"mcq", q:R`The smallest \(n\) such that the quaternion group \(Q_8\) is isomorphic to a subgroup of \(S_n\) is`,
    o:[R`\(4\)`,R`\(6\)`,R`\(24\)`,R`\(8\)`], a:3,
    s:R`A faithful action of \(Q_8\) on \(n\) points has some orbit with trivial point stabiliser: every non-trivial subgroup of \(Q_8\) contains \(-1\), so if every stabiliser were non-trivial, \(-1\) would fix every point. That orbit has size \(8\), so \(n\ge8\), and Cayley's theorem gives \(Q_8\hookrightarrow S_8\).` },
  { t:"mcq", q:R`Let \(G\) be a non-abelian group of order \(105\). The number of Sylow \(3\)-subgroups of \(G\) is`,
    o:[R`\(1\)`,R`\(5\)`,R`\(7\)`,R`\(35\)`], a:2,
    s:R`\(n_5\in\{1,21\}\), \(n_7\in\{1,15\}\); both large would need \(84+90>105\) elements, so one of \(P_5,P_7\) is normal and \(P_5P_7\) is a subgroup of order \(35\), cyclic, of index \(3\) (smallest prime), hence normal. Its characteristic subgroups \(P_5,P_7\) are normal in \(G\). If also \(n_3=1\), \(G\cong P_3\times P_5\times P_7\) is cyclic. So \(n_3\ne1\), and \(n_3\mid35,\ n_3\equiv1\pmod3\) gives \(n_3=7\).` },
  { t:"mcq", q:R`The number of normal subgroups of the dihedral group \(D_8\) of order \(16\) is`,
    o:[R`\(5\)`,R`\(7\)`,R`\(6\)`,R`\(9\)`], a:1,
    s:R`Every subgroup of the rotation group \(\langle r\rangle\cong\Z_8\) is normal: \(\tau(8)=4\) of them. A normal subgroup containing a reflection contains its whole class, which forces index \(\le2\): the two dihedral subgroups \(\langle r^2,s\rangle,\langle r^2,rs\rangle\) of index \(2\), and \(D_8\) itself. Total \(4+2+1=7\).` },
  { t:"mcq", q:R`The number of onto group homomorphisms from \(S_4\) to \(S_3\) is`,
    o:[R`\(6\)`,R`\(3\)`,R`\(1\)`,R`\(12\)`], a:0,
    s:R`The kernel must be a normal subgroup of order \(4\), so it is \(V_4\), and \(S_4/V_4\cong S_3\). Onto maps with this fixed kernel correspond to isomorphisms \(S_4/V_4\to S_3\), i.e. to \(\operatorname{Aut}(S_3)\), which has order \(6\).` },
  { t:"mcq", q:R`The number of elements of order \(3\) in \(A_4\times\Z_3\) is`,
    o:[R`\(8\)`,R`\(24\)`,R`\(27\)`,R`\(26\)`], a:3,
    s:R`Elements with \(x^3=e\): in \(A_4\) these are \(e\) and the \(8\) three-cycles (\(9\)); in \(\Z_3\), all \(3\). So \(9\cdot3=27\) solutions of \(x^3=e\); removing the identity leaves \(26\).` },

  /* ---------- Section B: MSQ ---------- */
  { t:"msq", q:R`Which of the following pairs of groups are isomorphic?`,
    o:[R`\(U(8)\) and \(U(12)\)`,R`\(U(16)\) and \(\Z_8\)`,R`\(\Z_6\times\Z_4\) and \(\Z_{12}\times\Z_2\)`,R`\(D_6\) (order \(12\)) and \(S_3\times\Z_2\)`], a:[0,2,3],
    s:R`(A) True: both are \(\Z_2\times\Z_2\) (every non-identity element has order \(2\)). (B) False: \(U(16)\cong\Z_2\times\Z_4\) has no element of order \(8\). (C) True: both are \(\Z_2\times\Z_4\times\Z_3\). (D) True: \(r^3\) is central in \(D_6\), and \(D_6=\langle r^2,s\rangle\times\langle r^3\rangle\cong D_3\times\Z_2\).` },
  { t:"msq", q:R`Let \(G\) be any group of order \(30\). Which of the following are true?`,
    o:[R`\(G\) has a normal subgroup of order \(15\)`,R`\(G\) has a normal Sylow \(5\)-subgroup`,R`\(G\) has a normal Sylow \(3\)-subgroup`,R`\(G\) is abelian`], a:[0,1,2],
    s:R`If \(n_3=10\) and \(n_5=6\), there would be \(20+24>30\) elements, so \(P_3\) or \(P_5\) is normal, and \(P_3P_5\) is a subgroup of order \(15\), of index \(2\), hence normal (A). It is cyclic, so \(P_3,P_5\) are characteristic in it and therefore normal in \(G\) (B, C). (D) False: \(D_{15}\) has order \(30\).` },
  { t:"msq", q:R`For which of the following \(n\) is there <b>no</b> simple group of order \(n\)?`,
    o:[R`\(56\)`,R`\(60\)`,R`\(148\)`,R`\(200\)`], a:[0,2,3],
    s:R`(A) \(56=2^3\cdot7\): if \(n_7=8\) there are \(48\) elements of order \(7\), leaving exactly \(8\) for a unique Sylow \(2\)-subgroup. So some Sylow subgroup is normal. (B) \(A_5\) is simple of order \(60\). (C) \(148=4\cdot37\): \(n_{37}\mid4\), \(n_{37}\equiv1\pmod{37}\) gives \(n_{37}=1\). (D) \(200=8\cdot25\): \(n_5\mid8\), \(n_5\equiv1\pmod5\) gives \(n_5=1\).` },
  { t:"msq", q:R`Which of the following are true?`,
    o:[R`\(S_7\) has an element of order \(10\)`,R`\(S_7\) has an element of order \(12\)`,R`\(S_7\) has an element of order \(15\)`,R`\(A_7\) has an element of order \(6\)`], a:[0,1,3],
    s:R`(A) True: \((5)(2)\). (B) True: \((4)(3)\). (C) False: order \(15\) needs a \(3\)-cycle and a \(5\)-cycle, i.e. \(8\) points. (D) True: \((1\,2\,3)(4\,5)(6\,7)\) is even (two transpositions) and has order \(6\).` },
  { t:"msq", q:R`Let \(G\) be a group and \(H\trianglelefteq G\). Which of the following are true?`,
    o:[R`If \(H\) and \(G/H\) are abelian, then \(G\) is abelian`,R`If \(G\) is cyclic, then \(G/H\) is cyclic`,R`If \(G/Z(G)\) is cyclic, then \(G\) is abelian`,R`If \(H\) and \(G/H\) are cyclic, then \(G\) is cyclic`], a:[1,2],
    s:R`(A) False: \(S_3\) with \(H=A_3\). (B) True: \(gH\) generates \(G/H\) when \(g\) generates \(G\). (C) True: standard; write \(x=g^ia,\ y=g^jb\) with \(a,b\in Z(G)\). (D) False: \(\Z_2\times\Z_2\) with \(H=\Z_2\times\{0\}\).` },
  { t:"msq", q:R`Consider group homomorphisms \(\varphi:\Z_{24}\to\Z_{18}\). Which of the following are true?`,
    o:[R`There are exactly \(6\) such homomorphisms`,R`Some \(\varphi\) is onto`,R`Some \(\varphi\) is one-one`,R`For every \(\varphi\), \(|\varphi(\Z_{24})|\) divides \(6\)`], a:[0,3],
    s:R`\(\varphi\) is fixed by \(x=\varphi(1)\) with \(24x\equiv0\pmod{18}\): there are \(\gcd(24,18)=6\) such \(x\) (A). The image is cyclic of order dividing \(\gcd(24,18)=6\) (D), so it is never onto (needs \(18\)) nor one-one (needs \(24\)).` },
  { t:"msq", q:R`Which of the following are true?`,
    o:[R`\((1\,2\,3)(4\,5)\) and \((1\,4)(2\,3\,5)\) are conjugate in \(S_5\)`,R`\((1\,2\,3)\) and \((1\,3\,2)\) are conjugate in \(A_4\)`,R`\((1\,2\,3\,4\,5)\) and \((1\,3\,5\,2\,4)\) are conjugate in \(A_5\)`,R`The centraliser of \((1\,2\,3)\) in \(S_5\) has order \(6\)`], a:[0,3],
    s:R`(A) True: same cycle type. (B) False: the \(8\) three-cycles split into two \(A_4\)-classes of size \(4\); \(\sigma\) and \(\sigma^{-1}\) lie in different ones. (C) False: \((1\,3\,5\,2\,4)=\sigma^2\) for \(\sigma=(1\,2\,3\,4\,5)\); the \(5\)-cycles split into two \(A_5\)-classes of size \(12\), with \(\sigma\sim\sigma^{4}\) but \(\sigma\not\sim\sigma^2\). (D) True: the class of \((1\,2\,3)\) has \(20\) elements, so the centraliser has \(120/20=6\) elements, namely \(\langle(1\,2\,3)\rangle\times\langle(4\,5)\rangle\).` },
  { t:"msq", q:R`Let \(p\) be an odd prime and \(G\) a group of order \(2p\). Which of the following are true?`,
    o:[R`\(G\) has a normal subgroup of order \(p\)`,R`\(G\) is either cyclic or isomorphic to \(D_p\)`,R`\(G\) has either exactly \(1\) or exactly \(p\) elements of order \(2\)`,R`\(|Z(G)|=2\)`], a:[0,1,2],
    s:R`(A) True: index \(2\). (B) True: with \(P=\langle a\rangle\) of order \(p\) and \(b\) of order \(2\), \(bab^{-1}=a^k\) with \(k^2\equiv1\pmod p\), so \(k=\pm1\). (C) True: \(\Z_{2p}\) has \(1\), \(D_p\) has \(p\). (D) False: \(Z(\Z_{2p})\) has order \(2p\) and \(Z(D_p)\) is trivial.` },
  { t:"msq", q:R`Which of the following are true for finite groups?`,
    o:[R`Every subgroup of index \(2\) is normal`,R`A subgroup whose index is the smallest prime dividing \(|G|\) is normal`,R`\(A_4\) has a subgroup of order \(6\)`,R`Every subgroup of index \(3\) is normal`], a:[0,1],
    s:R`(A) True: left and right cosets coincide. (B) True: \(G\) acts on the \(p\) cosets of \(H\); the kernel \(K\le H\) has \([G:K]\mid p!\) and also divides \(|G|\), forcing \([G:K]=p\), so \(K=H\). (C) False: the converse of Lagrange fails for \(A_4\). (D) False: \(\langle(1\,2)\rangle\) has index \(3\) in \(S_3\) and is not normal.` },
  { t:"msq", q:R`Let \(G=\Z_8\times\Z_2\). Which of the following are true?`,
    o:[R`\(G\) has exactly \(3\) elements of order \(2\)`,R`\(G\) has exactly \(4\) elements of order \(8\)`,R`\(G\) has a subgroup isomorphic to \(\Z_4\times\Z_2\)`,R`\(G/\langle(2,0)\rangle\cong\Z_2\times\Z_2\)`], a:[0,2,3],
    s:R`(A) True: \((4,0),(0,1),(4,1)\). (B) False: \((a,b)\) has order \(8\) iff \(a\) is odd: \(4\cdot2=8\) elements. (C) True: \(\langle2\rangle\times\Z_2\). (D) True: \(\langle(2,0)\rangle\) has order \(4\), the quotient has order \(4\) and is \(\Z_8/\langle2\rangle\times\Z_2\cong\Z_2\times\Z_2\).` },
];
const Q4 = [
  /* ---------- Section A: MCQ (CSIR NET / GATE previous-year style) ---------- */
  { t:"mcq", q:R`The number of units in the ring \(\Z[i]/\langle 3\rangle\) is`,
    o:[R`\(4\)`,R`\(6\)`,R`\(8\)`,R`\(9\)`], a:2,
    s:R`\(3\equiv3\pmod4\) is a Gaussian prime, so \(\langle3\rangle\) is maximal and \(\Z[i]/\langle3\rangle\) is a field with \(N(3)=9\) elements. Its units are the \(8\) non-zero elements.` },
  { t:"mcq", q:R`The number of ideals of the ring \(\Z_7[x]/\langle x^3-1\rangle\) is`,
    o:[R`\(3\)`,R`\(4\)`,R`\(6\)`,R`\(8\)`], a:3,
    s:R`Since \(3\mid7-1\), \(x^3-1=(x-1)(x-2)(x-4)\) over \(\Z_7\) with distinct roots. By CRT the ring is \(\cong\Z_7\times\Z_7\times\Z_7\), a product of \(3\) fields, which has \(2^3=8\) ideals.` },
  { t:"mcq", q:R`The ring \(\Q[x]/\langle x^2-5x+6\rangle\) is isomorphic to`,
    o:[R`a field`,R`\(\Q\times\Q\)`,R`\(\Q[x]/\langle x^2\rangle\)`,R`\(\Q(\sqrt5)\)`], a:1,
    s:R`\(x^2-5x+6=(x-2)(x-3)\) with coprime factors, so by CRT \(\Q[x]/\langle x^2-5x+6\rangle\cong\Q[x]/\langle x-2\rangle\times\Q[x]/\langle x-3\rangle\cong\Q\times\Q\). It has zero divisors and no non-zero nilpotents.` },
  { t:"mcq", q:R`In the ring \(\Z[\sqrt{-5}]\), the element \(2\) is`,
    o:[R`a unit`,R`a prime element`,R`irreducible but not prime`,R`reducible`], a:2,
    s:R`\(N(a+b\sqrt{-5})=a^2+5b^2\) never equals \(2\), so \(2\) has no proper factor: it is irreducible. But \(2\mid(1+\sqrt{-5})(1-\sqrt{-5})=6\) while \(2\nmid1\pm\sqrt{-5}\), so \(2\) is not prime. Hence \(\Z[\sqrt{-5}]\) is not a UFD.` },
  { t:"mcq", q:R`The number of ring homomorphisms \(f:\Z[x]\to\Z_{12}\) with \(f(1)=1\) is`,
    o:[R`\(1\)`,R`\(6\)`,R`\(4\)`,R`\(12\)`], a:3,
    s:R`A unital homomorphism from \(\Z[x]\) is fixed by the image of \(x\), which can be any element (universal property of the polynomial ring). So there are \(|\Z_{12}|=12\).` },
  { t:"mcq", q:R`The number of generators of the multiplicative group of the field \(\Z_2[x]/\langle x^4+x+1\rangle\) is`,
    o:[R`\(8\)`,R`\(4\)`,R`\(6\)`,R`\(15\)`], a:0,
    s:R`\(x^4+x+1\) is irreducible over \(\Z_2\), so the quotient is \(\F_{16}\). Its multiplicative group is cyclic of order \(15\), with \(\varphi(15)=8\) generators.` },
  { t:"mcq", q:R`The number of maximal ideals of \(\R[x]/\langle x^4-1\rangle\) is`,
    o:[R`\(2\)`,R`\(3\)`,R`\(4\)`,R`\(1\)`], a:1,
    s:R`Over \(\R\), \(x^4-1=(x-1)(x+1)(x^2+1)\) with \(3\) distinct irreducible factors. Maximal ideals of \(\R[x]/\langle f\rangle\) correspond to irreducible factors of \(f\): \(3\). (The ring is \(\R\times\R\times\C\).)` },
  { t:"mcq", q:R`Which of the following rings is a principal ideal domain?`,
    o:[R`\(\Z[x]\)`,R`\(\Q[x,y]\)`,R`\(\Z[i]\)`,R`\(\Z[\sqrt{-5}]\)`], a:2,
    s:R`\(\Z[i]\) is Euclidean with the norm, hence a PID. \(\langle2,x\rangle\subset\Z[x]\) and \(\langle x,y\rangle\subset\Q[x,y]\) are not principal, and \(\Z[\sqrt{-5}]\) is not even a UFD.` },
  { t:"mcq", q:R`The number of nilpotent elements in the ring \(\Z_4[x]/\langle x^2\rangle\) is`,
    o:[R`\(4\)`,R`\(12\)`,R`\(8\)`,R`\(16\)`], a:2,
    s:R`Write elements as \(a+bx\) (\(a,b\in\Z_4\)). Modulo the nilpotent ideal \(\langle2,x\rangle\) the ring is \(\Z_2\), a field, so the nilradical is exactly \(\langle2,x\rangle=\{a+bx: a\in\{0,2\}\}\): \(2\cdot4=8\) elements.` },
  { t:"mcq", q:R`The degree of the splitting field of \(x^3-2\) over \(\Q(\sqrt{-3})\) is`,
    o:[R`\(1\)`,R`\(2\)`,R`\(3\)`,R`\(6\)`], a:2,
    s:R`\(\Q(\sqrt{-3})=\Q(\omega)\) already contains the cube roots of unity. The splitting field is \(\Q(\omega,\sqrt[3]2)\) of degree \(6\) over \(\Q\), so its degree over \(\Q(\omega)\) is \(6/2=3\).` },
  /* ---------- Section B: MSQ ---------- */
  { t:"msq", q:R`Which of the following are fields?`,
    o:[R`\(\Z_3[x]/\langle x^2+x+2\rangle\)`,R`\(\Z_5[x]/\langle x^2+2\rangle\)`,R`\(\Z[x]/\langle x^2+1\rangle\)`,R`\(\R[x]/\langle x^2+x+1\rangle\)`], a:[0,1,3],
    s:R`(A) True: no root in \(\Z_3\) (\(2,1,2\)), so irreducible; field of order \(9\). (B) True: \(-2=3\) is not a square mod \(5\); field of order \(25\). (C) False: it is \(\Z[i]\), not a field. (D) True: discriminant \(-3\lt0\), so irreducible over \(\R\); the quotient is \(\cong\C\).` },
  { t:"msq", q:R`Which of the following statements about units are true?`,
    o:[R`The units of \(\Z[x]\) are \(\pm1\) only`,R`\(1+2x\) is a unit in \(\Z_4[x]\)`,R`Every unit of \(\Z_4[x]\) is a constant`,R`The units of \(\Z[i]\) are \(\pm1,\pm i\)`], a:[0,1,3],
    s:R`(A) True: \(\Z\) is an integral domain, so degrees add. (B) True: \((1+2x)^2=1+4x+4x^2=1\) in \(\Z_4[x]\). (C) False: by (B). (In general \(a_0+a_1x+\dots\) is a unit iff \(a_0\) is a unit and the other coefficients are nilpotent.) (D) True: \(N(\alpha)=1\).` },
  { t:"msq", q:R`Which of the following are correct for ideals of \(\Z[x]\)?`,
    o:[R`\(\langle 2,x\rangle\) is maximal`,R`\(\langle x\rangle\) is prime but not maximal`,R`\(\langle x^2+1\rangle\) is maximal`,R`\(\langle 4,x\rangle\) is prime`], a:[0,1],
    s:R`(A) True: quotient \(\Z_2\). (B) True: quotient \(\Z\), a domain but not a field. (C) False: quotient \(\Z[i]\) is not a field. (D) False: quotient \(\Z_4\) has zero divisors.` },
  { t:"msq", q:R`Which of the following rings are integral domains?`,
    o:[R`\(\Z[x]/\langle x^2\rangle\)`,R`\(\Z_p[x]\), \(p\) prime`,R`\(\C[x,y]/\langle xy\rangle\)`,R`\(\Z[\sqrt2]\)`], a:[1,3],
    s:R`(A) False: \(\bar x\) is a non-zero nilpotent. (B) True: polynomials over a field. (C) False: \(\bar x\cdot\bar y=0\). (D) True: a subring of \(\R\).` },
  { t:"msq", q:R`Let \(R\) be a finite commutative ring with \(1\). Which of the following are necessarily true?`,
    o:[R`Every prime ideal of \(R\) is maximal`,R`Every element of \(R\) is either a unit or a zero divisor`,R`If \(R\) is an integral domain then \(R\) is a field`,R`\(R\) has a non-zero nilpotent element`], a:[0,1,2],
    s:R`(A) True: \(R/P\) is a finite domain, hence a field. (B) True: if \(a\) is not a zero divisor, \(x\mapsto ax\) is injective, hence onto, so \(ax=1\) for some \(x\). (C) True: by (B). (D) False: \(\Z_6\) is reduced.` },
  { t:"msq", q:R`Which of the following are true about finite fields?`,
    o:[R`\(\F_{16}\) has a subfield with \(4\) elements`,R`\(\F_8\) has a subfield with \(4\) elements`,R`\(x^{16}-x\) is the product of all monic irreducible polynomials over \(\Z_2\) of degree dividing \(4\)`,R`There are exactly \(8\) monic irreducible cubics over \(\Z_3\)`], a:[0,2,3],
    s:R`(A) True: \(2\mid4\). (B) False: \(2\nmid3\). (C) True: the standard factorisation of \(x^{p^n}-x\). (D) True: \(\frac{3^3-3}3=8\).` },
  { t:"msq", q:R`Which of the following polynomials are irreducible over \(\Q\)?`,
    o:[R`\(x^4+1\)`,R`\(x^4-4\)`,R`\(x^3+x+1\)`,R`\(x^5+5x+10\)`], a:[0,2,3],
    s:R`(A) True: \((x+1)^4+1\) is Eisenstein at \(2\). (B) False: \((x^2-2)(x^2+2)\). (C) True: a reducible cubic has a rational root, and \(\pm1\) give \(3,-1\). (D) True: Eisenstein at \(5\).` },
  { t:"msq", q:R`Which of the following are true?`,
    o:[R`Every principal ideal domain is a unique factorisation domain`,R`\(\Z[x]\) is a principal ideal domain`,R`\(\Z[i]\) is a Euclidean domain`,R`\(\Z[x]\) is a unique factorisation domain`], a:[0,2,3],
    s:R`(A) True: standard. (B) False: \(\langle2,x\rangle\) is not principal. (C) True: with \(N(a+bi)=a^2+b^2\). (D) True: Gauss's lemma, \(R\) UFD implies \(R[x]\) UFD.` },
  { t:"msq", q:R`Which of the following statements about the characteristic are true?`,
    o:[R`The characteristic of \(\Z_3\times\Z_5\) is \(15\)`,R`A ring of characteristic \(6\) can be an integral domain`,R`The characteristic of an integral domain is \(0\) or a prime`,R`The characteristic of \(\Z_4[x]\) is \(4\)`], a:[0,2,3],
    s:R`(A) True: \(\mathrm{lcm}(3,5)\). (B) False: \((2\cdot1)(3\cdot1)=6\cdot1=0\) with both factors non-zero. (C) True: by the same argument. (D) True: \(4\cdot1=0\) and \(2\cdot1\ne0\).` },
  { t:"msq", q:R`Which of the following are true?`,
    o:[R`\([\C:\R]=2\)`,R`\(\Q(\sqrt2)\) and \(\Q(\sqrt3)\) are isomorphic as fields`,R`\(\R\) has a non-identity field automorphism`,R`The only automorphism of \(\Q(\sqrt[3]2)\) is the identity`], a:[0,3],
    s:R`(A) True: basis \(1,i\). (B) False: an isomorphism would send \(\sqrt2\) to a square root of \(2\) in \(\Q(\sqrt3)\), which does not exist. (C) False: an automorphism of \(\R\) preserves squares, hence order, and fixes \(\Q\), so it is the identity. (D) True: \(\sqrt[3]2\) is the only real root of \(x^3-2\).` },
];
const Q5 = [
  /* ---------- Section A: MCQ (CSIR NET / GATE previous-year style) ---------- */
  { t:"mcq", q:R`Let \(A=[a_{ij}]\) be the \(4\times4\) matrix with \(a_{ij}=|i-j|\). Then \(\det A\) is`,
    o:[R`\(12\)`,R`\(0\)`,R`\(-12\)`,R`\(-6\)`], a:2,
    s:R`For the distance matrix \([|i-j|]\) of order \(n\), \(\det=(-1)^{n-1}(n-1)2^{n-2}\). With \(n=4\): \((-1)^3\cdot3\cdot4=-12\). (Row operations \(R_i-R_{i+1}\) turn rows into \(\pm1\) patterns and reduce it quickly.)` },
  { t:"mcq", q:R`The rank of the \(4\times4\) matrix \(A=[a_{ij}]\) with \(a_{ij}=ij+1\) is`,
    o:[R`\(1\)`,R`\(2\)`,R`\(3\)`,R`\(4\)`], a:1,
    s:R`\(A=uu^T+ee^T\) with \(u=(1,2,3,4)^T\), \(e=(1,1,1,1)^T\). Every column lies in \(\operatorname{span}\{u,e\}\), and \(u,e\) are independent, so the rank is \(2\).` },
  { t:"mcq", q:R`Let \(A\in M_3(\R)\) with \(\det A=-2\). Then \(\det\big(\operatorname{adj}(A^T)\cdot3A^{-1}\big)\) is`,
    o:[R`\(-54\)`,R`\(54\)`,R`\(-27\)`,R`\(108\)`], a:0,
    s:R`\(\det\operatorname{adj}(A^T)=(\det A)^{2}=4\) and \(\det(3A^{-1})=3^3/\det A=27/(-2)\). The product is \(4\cdot(-13.5)=-54\).` },
  { t:"mcq", q:R`The number of \(2\times2\) matrices over \(\Z_3\) of rank exactly \(1\) is`,
    o:[R`\(24\)`,R`\(33\)`,R`\(48\)`,R`\(32\)`], a:3,
    s:R`There are \(3^4=81\) matrices, \(|GL_2(\F_3)|=(9-1)(9-3)=48\) of rank \(2\) and one of rank \(0\). So \(81-48-1=32\) have rank \(1\).` },
  { t:"mcq", q:R`The system \(x+2y+3z=6,\ 2x+3y+4z=9,\ 3x+4y+az=b\) has infinitely many solutions if and only if`,
    o:[R`\(a=5,\ b=12\)`,R`\(a=5,\ b\ne12\)`,R`\(a\ne5\)`,R`\(a=12,\ b=5\)`], a:0,
    s:R`Row reduction gives \(\begin{pmatrix}1&2&3&6\\0&-1&-2&-3\\0&0&5-a&12-b\end{pmatrix}\). For \(a\ne5\) the solution is unique; for \(a=5\) it is inconsistent unless \(b=12\), when the rank is \(2<3\) and there are infinitely many solutions.` },
  { t:"mcq", q:R`Let \(A\) be a real \(6\times8\) matrix of rank \(4\). The dimension of \(\{y\in\R^6:y^TA=0\}\) is`,
    o:[R`\(2\)`,R`\(4\)`,R`\(0\)`,R`\(6\)`], a:0,
    s:R`\(y^TA=0\iff A^Ty=0\). \(A^T\) is \(8\times6\) of rank \(4\), so its null space in \(\R^6\) has dimension \(6-4=2\).` },
  { t:"mcq", q:R`The dimension of the space of real symmetric \(4\times4\) matrices whose every row sum is \(0\) is`,
    o:[R`\(10\)`,R`\(7\)`,R`\(9\)`,R`\(6\)`], a:3,
    s:R`The \(6\) entries above the diagonal can be chosen freely; each diagonal entry is then forced (\(a_{ii}=-\sum_{j\ne i}a_{ij}\)), and symmetry makes the column sums zero too. So the dimension is \(\binom42=6\).` },
  { t:"mcq", q:R`Let \(W_1=\{x\in\R^5:x_1+x_2+x_3=0\}\) and \(W_2=\{x\in\R^5:x_3+x_4+x_5=0,\ x_1=x_5\}\). Then \(\dim(W_1\cap W_2)\) is`,
    o:[R`\(1\)`,R`\(3\)`,R`\(2\)`,R`\(4\)`], a:2,
    s:R`\(W_1\cap W_2\) is cut out by the three equations \((1,1,1,0,0)\), \((0,0,1,1,1)\), \((1,0,0,0,-1)\), which are independent. So \(\dim=5-3=2\).` },
  { t:"mcq", q:R`In \(P_3(\R)\), the dimension of \(\operatorname{span}\{(x-1)^3,\ (x-1)^2,\ x^3-1,\ x^3-3x^2+3x\}\) is`,
    o:[R`\(2\)`,R`\(3\)`,R`\(4\)`,R`\(1\)`], a:2,
    s:R`Write everything in powers of \(t=x-1\): \(x^3-1=t^3+3t^2+3t\) and \(x^3-3x^2+3x=t^3+1\). The span contains \(t^3,t^2\), hence \(t\) (from the third) and \(1\) (from the fourth). So it is all of \(P_3\): dimension \(4\).` },
  { t:"mcq", q:R`Let \(A\) be a real \(5\times4\) matrix of rank \(4\) and \(B\) a real \(4\times6\) matrix of rank \(3\). Then \(\operatorname{rank}(AB)\) is`,
    o:[R`\(4\)`,R`\(3\)`,R`\(2\)`,R`cannot be determined`], a:1,
    s:R`\(A\) has full column rank, so \(x\mapsto Ax\) is injective and \(\operatorname{rank}(AB)=\operatorname{rank}B=3\). (Sylvester also gives \(\operatorname{rank}AB\ge4+3-4=3\).)` },
  /* ---------- Section B: MSQ ---------- */
  { t:"msq", q:R`Let \(A\in M_n(\R)\) satisfy \(A^TA=I\). Which of the following are true?`,
    o:[R`\(\det A=\pm1\)`,R`\(A^{-1}=A^T\)`,R`\(A+I\) is invertible`,R`Every entry of \(A\) satisfies \(|a_{ij}|\le1\)`], a:[0,1,3],
    s:R`(A) True: \((\det A)^2=1\). (B) True: by definition. (C) False: \(A=-I\). (D) True: each column is a unit vector.` },
  { t:"msq", q:R`Let \(A,B\in M_n(\R)\). Which of the following are always true?`,
    o:[R`\(\det(A+B)=\det A+\det B\)`,R`\(\det(AB)=\det(BA)\)`,R`\(\det(-A)=(-1)^n\det A\)`,R`\(\det(A^TA)\ge0\)`], a:[1,2,3],
    s:R`(A) False: \(A=B=I_2\) gives \(4\ne2\). (B) True: both equal \(\det A\det B\). (C) True: \(\det(cA)=c^n\det A\). (D) True: it equals \((\det A)^2\).` },
  { t:"msq", q:R`Let \(A\in M_{m\times n}(\R)\) and \(B\in M_{n\times p}(\R)\). Which of the following are true?`,
    o:[R`\(\operatorname{rank}(AB)\le\operatorname{rank}A\)`,R`\(\operatorname{rank}(A^TA)=\operatorname{rank}A\)`,R`\(\operatorname{rank}(AB)\ge\operatorname{rank}A+\operatorname{rank}B-n\)`,R`If \(m=n=p\) then \(\operatorname{rank}(AB)=\operatorname{rank}(BA)\)`], a:[0,1,2],
    s:R`(A) True: the columns of \(AB\) lie in the column space of \(A\). (B) True: \(A^TAx=0\Rightarrow\|Ax\|^2=0\). (C) True: Sylvester's inequality. (D) False: \(A=E_{11},B=E_{12}\) give \(AB=E_{12}\ne0\) but \(BA=0\).` },
  { t:"msq", q:R`Let \(A\) be a real \(3\times4\) matrix. Which of the following are true?`,
    o:[R`\(Ax=0\) has a non-zero solution`,R`\(Ax=b\) has infinitely many solutions for every \(b\in\R^3\)`,R`If \(\operatorname{rank}A=3\), then \(Ax=b\) is solvable for every \(b\)`,R`\(Ax=b\) can have exactly one solution for some \(b\)`], a:[0,2],
    s:R`(A) True: \(4\) unknowns, rank \(\le3\). (B) False: if \(\operatorname{rank}A<3\) some \(b\) give no solution. (C) True: the column space is \(\R^3\). (D) False: a consistent system always has \(4-\operatorname{rank}A\ge1\) free variables.` },
  { t:"msq", q:R`Which of the following are subspaces of \(M_2(\R)\)?`,
    o:[R`\(\{A:A^2=0\}\)`,R`\(\{A:\operatorname{tr}A=0,\ a_{12}=a_{21}\}\)`,R`\(\{A:AN=NA\}\), where \(N=\begin{pmatrix}1&1\\0&1\end{pmatrix}\)`,R`\(\{A:\det A\ge0\}\)`], a:[1,2],
    s:R`(A) No: \(E_{12}\) and \(E_{21}\) square to \(0\) but \((E_{12}+E_{21})^2=I\). (B) Yes: two linear conditions. (C) Yes: \(AN=NA\) is linear in \(A\). (D) No: \(\operatorname{diag}(1,0)\) and \(\operatorname{diag}(0,-1)\) have \(\det=0\), but their sum has \(\det=-1\).` },
  { t:"msq", q:R`Let \(u=(1,i,0)\) and \(v=(i,-1,0)\) in \(\C^3\). Which of the following are true?`,
    o:[R`\(\{u,v\}\) is linearly dependent over \(\C\)`,R`\(\{u,v\}\) is linearly independent over \(\R\)`,R`\(\operatorname{span}_\C\{u,v\}\) has complex dimension \(1\)`,R`\(\operatorname{span}_\R\{u,v\}\) has real dimension \(1\)`], a:[0,1,2],
    s:R`\(v=iu\). (A) True. (B) True: \(au+bv=(a+bi)u=0\) with \(a,b\) real forces \(a=b=0\). (C) True. (D) False: the real span is \(2\)-dimensional.` },
  { t:"msq", q:R`Which of the following dimensions (over \(\R\)) are correct?`,
    o:[R`Real skew-symmetric \(4\times4\) matrices: \(6\)`,R`Real \(3\times3\) matrices of trace \(0\): \(8\)`,R`Real \(3\times3\) upper triangular matrices with zero diagonal: \(3\)`,R`Real symmetric \(3\times3\) matrices of trace \(0\): \(6\)`], a:[0,1,2],
    s:R`(A) \(\frac{4\cdot3}2=6\). (B) \(9-1=8\). (C) the entries \(a_{12},a_{13},a_{23}\): \(3\). (D) False: \(6-1=5\).` },
  { t:"msq", q:R`Which of the following are true?`,
    o:[R`\(GL_2(\F_3)\) has \(48\) elements`,R`\(x+y+z=0\) has \(25\) solutions in \(\F_5^3\)`,R`\(\F_2^3\) has exactly \(7\) one-dimensional subspaces`,R`\(\F_3^2\) has exactly \(3\) one-dimensional subspaces`], a:[0,1,2],
    s:R`(A) \((9-1)(9-3)=48\). (B) rank \(1\) in \(3\) unknowns: \(5^2\). (C) \(\frac{2^3-1}{2-1}=7\). (D) False: \(\frac{3^2-1}{3-1}=4\).` },
  { t:"msq", q:R`Let \(A,B\in M_n(\R)\) with \(n\ge3\). Which of the following are true?`,
    o:[R`If \(\operatorname{rank}A=n-1\) then \(\operatorname{rank}(\operatorname{adj}A)=1\)`,R`\(\operatorname{adj}(AB)=\operatorname{adj}B\,\operatorname{adj}A\)`,R`\(\operatorname{adj}(kA)=k^{n-1}\operatorname{adj}A\)`,R`If \(\operatorname{adj}A=0\) then \(A=0\)`], a:[0,1,2],
    s:R`(A) True: \(A\operatorname{adj}A=0\) gives \(\operatorname{rank}\operatorname{adj}A\le1\), and some \((n-1)\)-minor is non-zero. (B) True: standard (prove for invertible matrices, then by density). (C) True: each cofactor is an \((n-1)\)-minor. (D) False: any \(A\) of rank \(\le n-2\), e.g. \(E_{11}\).` },
  { t:"msq", q:R`Which of the following are true?`,
    o:[R`A real skew-symmetric matrix of odd order is singular`,R`The determinant of a Hermitian matrix is real`,R`The product of two real symmetric matrices is symmetric`,R`For an idempotent matrix \(A\), \(\operatorname{rank}A=\operatorname{tr}A\)`], a:[0,1,3],
    s:R`(A) True: \(\det A=\det(-A^T)=(-1)^n\det A\). (B) True: \(\det A^*=\overline{\det A}\). (C) False: \((AB)^T=BA\), which differs from \(AB\) in general. (D) True: the eigenvalues are \(0\) and \(1\), and \(A\) is diagonalizable.` }
];

/* ---------- Weekly Test 6 · Linear Algebra (7 Nov 2026) ---------- */
const Q6 = [
  /* ---------- Section A: MCQ ---------- */
  { t:"mcq", q:R`[CSIR NET Dec 2012] Let \(n\) be a positive integer and let \(M_n(\R)\) denote the space of all \(n\times n\) real matrices. If \(T:M_n(\R)\to M_n(\R)\) is a linear transformation such that \(T(A)=0\) whenever \(A\in M_n(\R)\) is symmetric or skew-symmetric, then the rank of \(T\) is`,
    o:[R`\(\frac{n(n+1)}{2}\)`,R`\(\frac{n(n-1)}{2}\)`,R`\(n\)`,R`\(0\)`], a:3,
    s:R`\(M_n(\R)=\mathrm{Sym}\oplus\mathrm{Skew}\), since \(A=\frac{A+A^T}2+\frac{A-A^T}2\). \(T\) vanishes on both summands, hence on their sum, so \(T=0\) and its rank is \(0\).` },
  { t:"mcq", q:R`Let \(W_1\) be the space of real \(3\times3\) upper triangular matrices and \(W_2\) the space of real \(3\times3\) symmetric matrices. Then \(\dim(W_1+W_2)\) is`,
    o:[R`\(6\)`,R`\(9\)`,R`\(8\)`,R`\(12\)`], a:1,
    s:R`\(\dim W_1=\dim W_2=6\) and \(W_1\cap W_2\) is the space of diagonal matrices, of dimension \(3\). So \(\dim(W_1+W_2)=6+6-3=9\): in fact \(W_1+W_2=M_3(\R)\).` },
  { t:"mcq", q:R`[GATE 2009] The dimension of the vector space \(V=\{A=(a_{ij})_{n\times n}: a_{ij}\in\C,\ a_{ij}=-\bar a_{ji}\}\) over the field \(\R\) is`,
    o:[R`\(n^2\)`,R`\(n^2-1\)`,R`\(n^2-n\)`,R`\(\frac{n^2}{2}\)`], a:0,
    s:R`\(V\) is the space of skew-Hermitian matrices. Each diagonal entry is purely imaginary (\(n\) real parameters); each of the \(\frac{n(n-1)}2\) entries above the diagonal is a free complex number (2 real parameters each) and fixes the entry below. Total \(n+n(n-1)=n^2\).` },
  { t:"mcq", q:R`Let \(W=\operatorname{span}\{(1,1,0,0,0),\ (0,1,1,0,0),\ (1,2,1,0,0),\ (0,0,0,1,1)\}\subseteq\R^5\). Then \(\dim(\R^5/W)\) is`,
    o:[R`\(1\)`,R`\(2\)`,R`\(3\)`,R`\(4\)`], a:1,
    s:R`The third vector is the sum of the first two, and the other three are independent, so \(\dim W=3\). Hence \(\dim(\R^5/W)=5-3=2\).` },
  { t:"mcq", q:R`The number of \(2\)-dimensional subspaces of \(\F_3^4\) is`,
    o:[R`\(130\)`,R`\(120\)`,R`\(260\)`,R`\(40\)`], a:0,
    s:R`Ordered pairs of independent vectors: \((3^4-1)(3^4-3)=80\cdot78\). Each plane has \((3^2-1)(3^2-3)=48\) such ordered bases. So the count is \(\frac{80\cdot78}{48}=130\).` },
  { t:"mcq", q:R`Let \(A\) be a real \(3\times3\) matrix with \(A^3=A\), \(\operatorname{tr}A=1\) and \(\operatorname{rank}A=3\). Then \(\det A\) is`,
    o:[R`\(1\)`,R`\(-1\)`,R`\(0\)`,R`not determined by the given data`], a:1,
    s:R`The minimal polynomial divides \(x^3-x=x(x-1)(x+1)\), so \(A\) is diagonalizable with eigenvalues in \(\{0,1,-1\}\). Rank \(3\) excludes \(0\). Three values \(\pm1\) with sum \(1\) must be \(1,1,-1\), so \(\det A=-1\).` },
  { t:"mcq", q:R`[CSIR NET June 2017] Let \(A\) be an \(n\times n\) self-adjoint matrix with eigenvalues \(\lambda_1,\dots,\lambda_n\). Let \(\|X\|_2=\sqrt{|x_1|^2+\dots+|x_n|^2}\) for \(X=(x_1,\dots,x_n)\in\C^n\). If \(p(A)=a_0I+a_1A+\dots+a_nA^n\), then \(\sup_{\|X\|_2=1}\|p(A)X\|_2\) is equal to`,
    o:[R`\(\max\{a_0+a_1\lambda_j+\dots+a_n\lambda_j^n:1\le j\le n\}\)`,R`\(\max\{|a_0+a_1\lambda_j+\dots+a_n\lambda_j^n|:1\le j\le n\}\)`,R`\(\min\{a_0+a_1\lambda_j+\dots+a_n\lambda_j^n:1\le j\le n\}\)`,R`\(\min\{|a_0+a_1\lambda_j+\dots+a_n\lambda_j^n|:1\le j\le n\}\)`], a:1,
    s:R`\(A=UDU^*\) with \(U\) unitary and \(D\) real diagonal, so \(p(A)=U\,p(D)\,U^*\) and \(\|p(A)X\|_2=\|p(D)U^*X\|_2\). As \(X\) runs over unit vectors so does \(U^*X\), and the sup of \(\|p(D)Y\|_2\) is \(\max_j|p(\lambda_j)|\) (take \(Y=e_j\)). The values \(p(\lambda_j)\) may be negative, so the modulus is needed.` },
  { t:"mcq", q:R`[CSIR NET Dec 2016] Let \(A\) be a \(n\times n\) non-singular matrix with real entries. Let \(B=A^T\) denote the transpose of \(A\). Which of the following matrices are positive definite?`,
    o:[R`\(A+B\)`,R`\(A^{-1}+B^{-1}\)`,R`\(AB\)`,R`\(ABA\)`], a:2,
    s:R`\(x^TAA^Tx=\|A^Tx\|^2\gt0\) for \(x\ne0\) since \(A^T\) is non-singular, and \(AA^T\) is symmetric. For the rotation \(A=\begin{pmatrix}0&1\\-1&0\end{pmatrix}\), \(A+A^T=0\) and \(A^{-1}+(A^T)^{-1}=0\). \(ABA=AA^TA\) need not even be symmetric.` },
  { t:"mcq", q:R`[GATE 2012] Let \(H\) be a Hilbert space and \(S^\perp\) denote the orthogonal complement of a set \(S\subseteq H\). Which of the following is INCORRECT?`,
    o:[R`For \(S_1,S_2\subseteq H\): \(S_1\subseteq S_2\Rightarrow S_1^\perp\subseteq S_2^\perp\)`,R`\(S\subseteq(S^\perp)^\perp\)`,R`\(\{0\}^\perp=H\)`,R`\(S^\perp\) is always closed`], a:0,
    s:R`Inclusion reverses: \(S_1\subseteq S_2\Rightarrow S_2^\perp\subseteq S_1^\perp\). In \(\R^2\), \(S_1=\{e_1\}\subseteq S_2=\{e_1,e_2\}\) but \(S_1^\perp=\operatorname{span}\{e_2\}\not\subseteq S_2^\perp=\{0\}\). (B), (C) are immediate and (D) holds since \(S^\perp=\bigcap_{s\in S}\ker\langle\cdot,s\rangle\) is an intersection of closed sets.` },
  { t:"mcq", q:R`[CSIR NET June 2016] Let \(A=\begin{bmatrix}1&0\\0&-1\end{bmatrix}\). Let \(f:\R^2\times\R^2\to\R\) be defined by \(f(v,w)=w^TAv\). Pick the correct statement from below:`,
    o:[R`There exists an eigenvector \(v\) of \(A\) such that \(Av\) is perpendicular to \(v\)`,R`The set \(\{v\in\R^2\mid f(v,v)=0\}\) is a nonzero subspace of \(\R^2\)`,R`If \(v,w\in\R^2\) are nonzero vectors such that \(f(v,v)=0=f(w,w)\), then \(v\) is a scalar multiple of \(w\)`,R`For every \(v\in\R^2\), there exists a nonzero \(w\in\R^2\) such that \(f(v,w)=0\)`], a:3,
    s:R`(D): \(f(v,w)=0\) is one linear equation in the two unknowns of \(w\), so it has a nonzero solution. (A): eigenvectors satisfy \(Av=\pm v\), never perpendicular to \(v\ne0\). (B): \(f(v,v)=x^2-y^2=0\) is the pair of lines \(y=\pm x\), not a subspace. (C): \(v=(1,1)\), \(w=(1,-1)\).` },
  /* ---------- Section B: MSQ ---------- */
  { t:"msq", q:R`Let \(W_1,W_2\) be subspaces of \(\R^7\) with \(\dim W_1=4\) and \(\dim W_2=5\). Which of the following are always true?`,
    o:[R`\(W_1\cap W_2\ne\{0\}\)`,R`\(W_1+W_2=\R^7\)`,R`\(\dim(W_1\cap W_2)\ge2\)`,R`\(\R^7=W_1\oplus W_2\) is possible`], a:[0,2],
    s:R`\(\dim(W_1\cap W_2)=4+5-\dim(W_1+W_2)\ge9-7=2\), giving (A) and (C). (B) fails if \(W_1\subseteq W_2\). (D) is impossible: a direct sum would have dimension \(9\gt7\).` },
  { t:"msq", q:R`Let \(V\) be a finite-dimensional real vector space and \(W\) a subspace. Which of the following are true?`,
    o:[R`\(\dim(V/W)=\dim V-\dim W\)`,R`If \(T:V\to U\) is linear and \(W\subseteq\ker T\), then \(\bar T(v+W)=T(v)\) is a well-defined linear map \(V/W\to U\)`,R`\(V/W\) is isomorphic to every complement \(W'\) of \(W\) (i.e. every \(W'\) with \(V=W\oplus W'\))`,R`\(V/W\) is a subspace of \(V\)`], a:[0,1,2],
    s:R`(A) The quotient map \(V\to V/W\) is onto with kernel \(W\). (B) If \(v-v'\in W\subseteq\ker T\) then \(Tv=Tv'\). (C) \(W'\to V/W,\ w'\mapsto w'+W\) is injective (\(W\cap W'=0\)) and onto (\(V=W+W'\)). (D) False: elements of \(V/W\) are cosets, not vectors of \(V\).` },
  { t:"msq", q:R`[CSIR NET Dec 2012] Let \(n\) be an integer, \(n\ge3\), and let \(u_1,u_2,\dots,u_n\) be \(n\) linearly independent elements in a vector space over \(\R\). Set \(u_0=0\) and \(u_{n+1}=u_1\). Define \(v_i=u_i+u_{i+1}\) and \(w_i=u_{i-1}+u_i\) for \(i=1,2,\dots,n\). Then`,
    o:[R`\(v_1,v_2,\dots,v_n\) are linearly independent, if \(n=2010\)`,R`\(v_1,v_2,\dots,v_n\) are linearly independent, if \(n=2011\)`,R`\(w_1,w_2,\dots,w_n\) are linearly independent, if \(n=2010\)`,R`\(w_1,w_2,\dots,w_n\) are linearly independent, if \(n=2011\)`], a:[1,2,3],
    s:R`The coordinate matrix of the \(v_i\) is \(I+P\) with \(P\) the cyclic shift, and \(\det(I+P)=1-(-1)^n\): \(0\) for even \(n\) (indeed \(v_1-v_2+v_3-\dots-v_n=0\)) and \(2\) for odd \(n\). Since \(u_0=0\), \(w_1=u_1\), \(w_i=u_{i-1}+u_i\): a triangular system, independent for every \(n\).` },
  { t:"msq", q:R`[CSIR NET June 2019] Let \(L(\R^n)\) be the space of \(\R\)-linear maps from \(\R^n\) to \(\R^n\). If \(\operatorname{Ker}(T)\) denotes the kernel (null space) of \(T\) then which of the following are true?`,
    o:[R`There exists \(T\in L(\R^5)\setminus\{0\}\) such that \(\operatorname{Range}(T)=\operatorname{Ker}(T)\)`,R`There does not exist \(T\in L(\R^5)\setminus\{0\}\) such that \(\operatorname{Range}(T)=\operatorname{Ker}(T)\)`,R`There exists \(T\in L(\R^6)\setminus\{0\}\) such that \(\operatorname{Range}(T)=\operatorname{Ker}(T)\)`,R`There does not exist \(T\in L(\R^6)\setminus\{0\}\) such that \(\operatorname{Range}(T)=\operatorname{Ker}(T)\)`], a:[1,2],
    s:R`If \(\operatorname{Range}T=\operatorname{Ker}T\) has dimension \(r\), rank–nullity gives \(n=2r\), so \(n=5\) is impossible. For \(n=6\), \(T=\begin{pmatrix}0&I_3\\0&0\end{pmatrix}\) has range \(=\) kernel \(=\operatorname{span}\{e_1,e_2,e_3\}\).` },
  { t:"msq", q:R`Let \(A\in M_4(\R)\) have minimal polynomial \(x^2(x-1)\). Which of the following are true?`,
    o:[R`\(A\) is diagonalizable`,R`\(\operatorname{rank}A\ge2\)`,R`\(A^3=A^2\)`,R`\(\operatorname{tr}A\in\{1,2\}\)`], a:[1,2,3],
    s:R`(A) False: the factor \(x^2\) is repeated. The Jordan form has a \(J_2(0)\) block, at least one block for \(1\), and \(1\times1\) blocks otherwise: \(J_2(0)\oplus[1]\oplus[0]\) or \(J_2(0)\oplus[1]\oplus[1]\). So rank \(\in\{2,3\}\) and trace \(\in\{1,2\}\). (C) The minimal polynomial divides \(x^3-x^2\).` },
  { t:"msq", q:R`[CSIR NET Dec 2016] Let \(A=\begin{pmatrix}1&1\\1&0\end{pmatrix}\) and let \(\alpha_n\) and \(\beta_n\) denote the two eigenvalues of \(A^n\) such that \(|\alpha_n|\ge|\beta_n|\). Then`,
    o:[R`\(\alpha_n\to\infty\) as \(n\to\infty\)`,R`\(\beta_n\to0\) as \(n\to\infty\)`,R`\(\beta_n\) is positive if \(n\) is even`,R`\(\beta_n\) is negative if \(n\) is odd`], a:[0,1,2,3],
    s:R`The eigenvalues of \(A\) are \(\varphi=\frac{1+\sqrt5}2\gt1\) and \(\psi=\frac{1-\sqrt5}2\in(-1,0)\). Those of \(A^n\) are \(\alpha_n=\varphi^n\to\infty\) and \(\beta_n=\psi^n\to0\), with the sign of \(\beta_n\) equal to \((-1)^n\).` },
  { t:"msq", q:R`[CSIR NET June 2018] Let \(A\) be a \((6\times6)\) matrix over \(\R\) with characteristic polynomial \(=(x-3)^2(x-2)^4\) and minimal polynomial \(=(x-3)(x-2)^2\). Then Jordan canonical form of \(A\) can be`,
    o:[R`\(\begin{pmatrix}3&0&0&0&0&0\\0&3&0&0&0&0\\0&0&2&1&0&0\\0&0&0&2&1&0\\0&0&0&0&2&1\\0&0&0&0&0&2\end{pmatrix}\)`,R`\(\begin{pmatrix}3&0&0&0&0&0\\0&3&0&0&0&0\\0&0&2&1&0&0\\0&0&0&2&0&0\\0&0&0&0&2&0\\0&0&0&0&0&2\end{pmatrix}\)`,R`\(\begin{pmatrix}3&0&0&0&0&0\\0&3&0&0&0&0\\0&0&2&1&0&0\\0&0&0&2&0&0\\0&0&0&0&2&1\\0&0&0&0&0&2\end{pmatrix}\)`,R`\(\begin{pmatrix}3&1&0&0&0&0\\0&3&0&0&0&0\\0&0&2&1&0&0\\0&0&0&2&0&0\\0&0&0&0&2&1\\0&0&0&0&0&2\end{pmatrix}\)`], a:[1,2],
    s:R`The exponent of \(x-3\) in the minimal polynomial is the size of the largest 3-block: \(1\), so two \(1\times1\) blocks for \(3\) (kills D). The largest 2-block has size \(2\), and the 2-blocks fill \(4\): \(2+1+1\) (B) or \(2+2\) (C). (A) has a \(4\times4\) block, giving \((x-2)^4\).` },
  { t:"msq", q:R`[CSIR NET June 2017] Let \(A=\begin{bmatrix}3&1&2\\1&2&3\\2&3&1\end{bmatrix}\) and \(Q(X)=X^tAX\) for \(X\in\R^3\). Then`,
    o:[R`\(A\) has exactly two positive eigenvalues`,R`all the eigenvalues of \(A\) are positive`,R`\(Q(X)\ge0\) for all \(X\in\R^3\)`,R`\(Q(X)\lt0\) for some \(X\in\R^3\)`], a:[0,3],
    s:R`Each row sums to \(6\), so \(6\) is an eigenvalue with eigenvector \((1,1,1)\). The other two have sum \(\operatorname{tr}A-6=0\) and product \(\det A/6=-18/6=-3\): they are \(\pm\sqrt3\). One negative eigenvalue gives a vector with \(Q\lt0\), e.g. \(Q(1,1,-2)=-9\).` },
  { t:"msq", q:R`[CSIR NET June 2019] Let \(\langle\,,\rangle:\R^n\times\R^n\to\R\) denote the standard inner product on \(\R^n\). For a non zero \(w\in\R^n\), define \(T_w:\R^n\to\R^n\) by \(T_w(v)=v-\frac{2\langle v,w\rangle}{\langle w,w\rangle}w\), for \(v\in\R^n\). Which of the following are true?`,
    o:[R`\(\det(T_w)=1\)`,R`\(\langle T_w(v_1),T_w(v_2)\rangle=\langle v_1,v_2\rangle\ \forall v_1,v_2\in\R^n\)`,R`\(T_w=T_w^{-1}\)`,R`\(T_{2w}=2T_w\)`], a:[1,2],
    s:R`\(T_w\) is the reflection in the hyperplane \(w^\perp\): \(T_ww=-w\) and \(T_w\) fixes \(w^\perp\). So it is orthogonal (B), \(T_w^2=I\) (C), and \(\det T_w=-1\) (A false). The formula is unchanged when \(w\) is scaled, so \(T_{2w}=T_w\ne2T_w\).` },
  { t:"msq", q:R`Let \(P\in M_n(\R)\), \(n\ge2\), satisfy \(P^2=P=P^T\) (an orthogonal projection) with \(P\ne0\) and \(P\ne I\). Which of the following are true?`,
    o:[R`\(\|Px\|\le\|x\|\) for all \(x\in\R^n\)`,R`\(I-P\) is also an orthogonal projection`,R`Every eigenvalue of \(P\) is \(0\) or \(1\)`,R`\(P\) is invertible`], a:[0,1,2],
    s:R`(A) \(x=Px+(I-P)x\) with \(\langle Px,(I-P)x\rangle=x^TP^T(I-P)x=x^T(P-P^2)x=0\), so \(\|x\|^2=\|Px\|^2+\|(I-P)x\|^2\). (B) \((I-P)^2=I-P=(I-P)^T\). (C) \(\lambda^2=\lambda\). (D) False: an invertible idempotent is \(I\).` }
];

const WEEKLY = [{
  id:"wt1-algebra", title:"Weekly Test 1 · Abstract Algebra", sid:"alg", date:"10 Oct 2026",
  syllabus:"Sets, Relations & Functions · Groups · Subgroups · Normal Subgroups · Cyclic Groups",
  minutes:45, mcq:{ plus:2, minus:2/3 }, msq:{ plus:2 },
  note:R`\(\Z_n\): additive cyclic group of order \(n\); \(U(n)\): group of units modulo \(n\); \(\F_q\): field with \(q\) elements.`,
  qs:Q
},{
  id:"wt2-algebra", title:"Weekly Test 2 · Abstract Algebra", sid:"alg", date:"17 Oct 2026",
  syllabus:"Classes of 12–16 Oct: Quotient Groups · Homomorphisms & Permutation Groups · Dihedral, Q8 & Sylow · Rings · Ideals & Quotient Rings",
  minutes:60, mcq:{ plus:2, minus:2/3 }, msq:{ plus:2 },
  note:R`\(\Z_n\): integers mod \(n\); \(D_n\): dihedral group of order \(2n\); \(Q_8\): quaternion group; \(\F_q\): field with \(q\) elements. Ring homomorphisms need not send \(1\) to \(1\) unless stated.`,
  qs:Q2
},{
  id:"wt3-group-theory", title:"Weekly Test 3 · Group Theory", sid:"alg", date:"20 Oct 2026",
  syllabus:"CSIR NET syllabus: Groups · Subgroups · Normal & Quotient Groups · Homomorphisms · Cyclic Groups · Permutation Groups · Cayley's Theorem · Class Equation · Sylow Theorems",
  minutes:60, mcq:{ plus:2, minus:2/3 }, msq:{ plus:2 },
  note:R`\(\Z_n\): integers mod \(n\); \(U(n)\): group of units modulo \(n\); \(D_n\): dihedral group of order \(2n\); \(Q_8\): quaternion group; \(Z(G)\): centre of \(G\).`,
  qs:Q3
},{
  id:"wt4-rings-fields", title:"Weekly Test 4 · Rings and Field Theory", sid:"alg", date:"24 Oct 2026",
  syllabus:"CSIR NET syllabus: Rings · Ideals · Prime & Maximal Ideals · Quotient Rings · Ring Homomorphisms · ID, PID, UFD, Euclidean Domains · Polynomial Rings & Irreducibility · Fields, Finite Fields, Field Extensions",
  minutes:60, mcq:{ plus:2, minus:2/3 }, msq:{ plus:2 },
  note:R`Questions are framed on CSIR NET and GATE previous-year patterns. \(\Z_n\): integers mod \(n\); \(\F_q\): field with \(q\) elements; \(\Z[i]\): Gaussian integers; \(N(a+b\sqrt d)=a^2-db^2\). Rings are commutative with \(1\) unless stated.`,
  qs:Q4
},{
  id:"wt5-linear-algebra", title:"Weekly Test 5 · Linear Algebra", sid:"lin", date:"1 Nov 2026",
  syllabus:"Classes of 26–30 Oct: Matrix Theory I–III (special matrices, determinants, adjoint, rank, systems of linear equations) · Vector Spaces I–II (subspaces, span, linear independence, basis and dimension)",
  minutes:60, mcq:{ plus:2, minus:2/3 }, msq:{ plus:2 },
  note:R`Questions are framed on CSIR NET and GATE previous-year patterns. \(\F_q\): field with \(q\) elements; \(P_n\): real polynomials of degree \(\le n\); \(E_{ij}\): matrix unit; \(\operatorname{adj}A\): adjoint (adjugate) of \(A\).`,
  qs:Q5
},{
  id:"wt6-linear-algebra", title:"Weekly Test 6 · Linear Algebra", sid:"lin", date:"7 Nov 2026",
  syllabus:"Classes of 29 Oct – 5 Nov: Vector Spaces III–V (sums, direct sums, quotient spaces, counting over finite fields, bases and dimension) · Diagonalization and the Minimal Polynomial · Inner Product Spaces I–II",
  minutes:60, mcq:{ plus:2, minus:2/3 }, msq:{ plus:2 },
  note:R`12 of the 20 questions are actual CSIR NET / GATE previous-year questions (source in brackets). \(\F_q\): field with \(q\) elements; \(V/W\): quotient space; \(S^\perp\): orthogonal complement; \(J_k(\lambda)\): Jordan block.`,
  qs:Q6
}];
const KEYS=["A","B","C","D"];
const base=()=>WEEKLY.find(t=>t.id===W.test)||WEEKLY[WEEKLY.length-1];
const T=()=>{ const b=base(); return W.qs&&W.qsFor===b.id?{ ...b, qs:W.qs }:b; };
const maxOf=t=>t.qs.reduce((s,q)=>s+(q.t==="msq"?t.msq.plus:t.mcq.plus),0);
const nA=t=>t.qs.filter(q=>q.t!=="msq").length;
const fmt=sec=>{ sec=Math.max(0,Math.round(sec)); const h=Math.floor(sec/3600), m=Math.floor(sec%3600/60), s=sec%60; return (h?h+":":"")+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0"); };
const fs2=n=>String(Math.round(n*100)/100);
const W={ test:null, phase:"start", ans:[], mk:[], cur:0, start:0, end:0, confirming:false, msg:"", tab:"test", rows:null, unsub:null, rowsFor:null };
let tick=null;
const uid=()=>{ try{ const u=app.auth&&app.auth.current(); return u?u.uid:null; }catch(e){ return null; } };
const saveKey=()=>"rc-wt-"+(app.session&&app.session.u)+"-"+T().id;

function answered(k){ const a=W.ans[k]; return T().qs[k].t==="msq"?a.length>0:a!==null; }
function status(k){ const q=T().qs[k], a=W.ans[k]; if(!answered(k)) return "skip"; return (q.t==="msq"?sameSet(a,q.a):a===q.a)?"ok":"bad"; }
function marks(k){ const t=T(), st=status(k), msq=t.qs[k].t==="msq"; return st==="ok"?(msq?t.msq.plus:t.mcq.plus):st==="bad"?(msq?0:-t.mcq.minus):0; }
function grade(){ let c=0,w=0,A=0,B=0; T().qs.forEach((q,k)=>{ const st=status(k); if(st==="ok")c++; if(st==="bad")w++; if(q.t==="msq")B+=marks(k); else A+=marks(k); }); return { correct:c, wrong:w, skipped:T().qs.length-c-w, secA:A, secB:B, score:A+B }; }
const remaining=()=>T().minutes*60-(Date.now()-W.start)/1000;

function listen(){
  const t=T(); if(W.rowsFor===t.id||!app.db) return;
  if(W.unsub) try{ W.unsub(); }catch(e){}
  W.rows=null; W.rowsFor=t.id;
  W.unsub=app.db.collection("results/"+t.id+"/entries").limit(500).onSnapshot(s=>{
    W.rows=s.docs.map(d=>({ id:d.id, ...d.data() })).sort((a,b)=>(b.score-a.score)||(a.timeSec-b.timeSec));
    if(ui.view==="weekly"&&(W.tab==="rank"||W.phase!=="test")) draw();
  },()=>{ W.rows=W.rows||[]; if(ui.view==="weekly") draw(); });
}

function vWeekly(){
  if(!W.test){
    W.test=WEEKLY[WEEKLY.length-1].id;
    const saved=store.get(saveKey(),null);
    if(saved&&saved.start&&Date.now()-saved.start<T().minutes*60000){ Object.assign(W,{ phase:"test", ans:saved.ans, mk:saved.mk, start:saved.start, cur:saved.cur||0, qs:saved.ord?shuffleQs(base().qs,saved.ord):null, qsFor:base().id }); startTick(); }
  }
  listen();
  return `<div id="wk" style="display:flex;flex-direction:column;gap:18px">${body()}</div>`;
}
function body(){
  const t=T();
  const tabs=`<div class="wk-tabs" role="tablist">
    <button role="tab" data-wtab="test" aria-selected="${W.tab==="test"}">Test</button>
    <button role="tab" data-wtab="rank" aria-selected="${W.tab==="rank"}">Rank list</button></div>`;
  const pick=WEEKLY.length>1&&W.phase!=="test"?`<div class="parts" style="margin-top:10px">${WEEKLY.map((x,i)=>`<button class="btn ${x.id===t.id?"primary":"ghost"} sm" data-wtest="${x.id}">Weekly Test ${i+1}</button>`).join("")}</div>`:"";
  const head=`<div class="wk-head"><div><p class="eyebrow" style="color:var(--gold-ink)">Ramanujan Class, Namakkal · ${esc(t.date)}</p><h2 style="font-family:var(--f-display);font-weight:400;margin:4px 0 0">${esc(t.title)}</h2>${pick}</div>${W.phase==="test"?"":tabs}</div>`;
  if(W.tab==="rank"&&W.phase!=="test") return head+rankHTML();
  return head+(W.phase==="start"?startHTML():W.phase==="test"?testHTML():resultHTML());
}
function startHTML(){
  const t=T(), a=nA(t), b=t.qs.length-a, mine=W.rows&&W.rows.find(r=>r.id===uid());
  return `<div class="wk-grid2">
    <div class="panel">
      <h3 style="margin:0 0 4px">${esc(t.syllabus)}</h3>
      <ul class="wk-facts"><li><b>${t.qs.length}</b><span>Questions</span></li><li><b>${t.minutes} min</b><span>Time</span></li><li><b>${maxOf(t)}</b><span>Maximum marks</span></li></ul>
      <div class="wk-sec"><b>Section A · MCQ · Q1–Q${a}</b><span>Exactly one option is correct. +${t.mcq.plus} each, −${fs2(t.mcq.minus)} for a wrong answer.</span></div>
      <div class="wk-sec"><b>Section B · MSQ · Q${a+1}–Q${a+b}</b><span>One or more options are correct. +${t.msq.plus} only for the exact set of correct options. No negative marks.</span></div>
      <p class="hint mjx" style="margin-top:12px">${t.note}</p>
    </div>
    <div class="panel" style="display:flex;flex-direction:column;gap:12px;justify-content:center">
      <p style="margin:0">Taking the test as <b>${esc(app.session.name)}</b>.</p>
      <p class="hint" style="margin:0">${app.session.admin?"Teacher preview: your score is not added to the rank list.":mine?`Your best so far: <b>${fs2(mine.score)} / ${maxOf(t)}</b>. Only your best attempt counts.`:"Your score goes on the batch rank list. Only your best attempt counts."}</p>
      <p class="hint" style="margin:0">The timer keeps running if you leave this page, so finish in one sitting.</p>
      <button class="btn primary" data-wgo="begin">Start test</button>
    </div></div>`;
}
function palBtn(k){ return `<button data-wq="${k}" class="${answered(k)?"ans":""} ${W.mk[k]?"mk":""} ${k===W.cur?"cur":""}" aria-label="Question ${k+1}">${k+1}</button>`; }
function testHTML(){
  const t=T(), i=W.cur, q=t.qs[i], msq=q.t==="msq", a=nA(t);
  const sel=k=>msq?W.ans[i].includes(k):W.ans[i]===k;
  const done=t.qs.filter((_,k)=>answered(k)).length;
  return `<div class="wk-test">
    <div class="panel">
      <div class="wk-qmeta"><span class="hint">Section ${msq?"B":"A"} · Question ${i+1} of ${t.qs.length}</span><b class="wk-mtimer" id="wkTimer2">${fmt(remaining())}</b><span class="pill ${msq?"gold":"blue"}">${msq?"MSQ · select all that apply":"MCQ · one correct"}</span></div>
      <p class="wk-q mjx">${q.q}</p>
      <p class="hint">${msq?`+${t.msq.plus} only for the exact set · no negative marks`:`+${t.mcq.plus} if correct · −${fs2(t.mcq.minus)} if wrong`}</p>
      <div class="wk-opts ${q.t}">${q.o.map((o,k)=>`<button class="wk-opt" data-wk="${k}" aria-pressed="${sel(k)}"><span class="key">${KEYS[k]}</span><span class="val mjx">${o}</span></button>`).join("")}</div>
      <div class="wk-nav">
        <div><button class="btn ghost sm" data-wgo="clear" ${answered(i)?"":"disabled"}>Clear answer</button> <button class="btn ghost sm" data-wgo="mark">${W.mk[i]?"Unmark":"Mark for review"}</button></div>
        <div><button class="btn ghost" data-wgo="prev" ${i===0?"disabled":""}>Previous</button> <button class="btn primary" data-wgo="next">${i===t.qs.length-1?"Review &amp; submit":"Save &amp; next"}</button></div>
      </div>
    </div>
    <aside class="wk-side">
      <div class="panel"><div class="hint">Time left</div><div class="wk-timer" id="wkTimer">${fmt(remaining())}</div></div>
      <div class="panel">
        <div class="hint">Answer sheet · ${done}/${t.qs.length} answered</div>
        <div class="wk-pal-sec">Section A · MCQ</div><div class="wk-pal">${t.qs.slice(0,a).map((_,k)=>palBtn(k)).join("")}</div>
        <div class="wk-pal-sec">Section B · MSQ</div><div class="wk-pal">${t.qs.slice(a).map((_,k)=>palBtn(k+a)).join("")}</div>
      </div>
      ${W.confirming?`<div class="wk-confirm"><span>Submit now? ${t.qs.length-done} unanswered, ${W.mk.filter(Boolean).length} marked for review.</span><div><button class="btn primary sm" data-wgo="submit">Submit test</button> <button class="btn ghost sm" data-wgo="keep">Keep working</button></div></div>`
        :`<button class="btn ghost" data-wgo="confirm">Submit test</button>`}
    </aside></div>`;
}
function ansText(k,a){ const q=T().qs[k]; if(q.t==="msq") return a.length?a.map(x=>KEYS[x]).join(", "):"—"; return a===null?"—":KEYS[a]+". "+q.o[a]; }
function resultHTML(){
  const t=T(), g=grade(), secs=(W.end-W.start)/1000, a=nA(t);
  const maxA=a*t.mcq.plus, maxB=(t.qs.length-a)*t.msq.plus;
  return `<div class="panel">
    <div class="wk-score"><div><div class="hint">${esc(app.session.name)}</div><div class="wk-big">${fs2(g.score)}<small> / ${maxOf(t)}</small></div></div>
      <div class="wk-tally"><div><b style="color:var(--ok)">${g.correct}</b>Correct</div><div><b style="color:var(--bad)">${g.wrong}</b>Wrong</div><div><b>${g.skipped}</b>Skipped</div><div><b>${fmt(secs)}</b>Time taken</div></div></div>
    <div class="wk-split"><div>Section A (MCQ)<b>${fs2(g.secA)} / ${maxA}</b></div><div>Section B (MSQ)<b>${fs2(g.secB)} / ${maxB}</b></div></div>
    <p class="hint" id="wkMsg" style="margin-top:12px">${esc(W.msg)}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px"><button class="btn primary" data-wtab="rank">See rank list</button><button class="btn ghost" data-wgo="again">Retake test</button></div>
  </div>
  <h3 style="font-family:var(--f-display);font-weight:400;margin:6px 0 0">Answers and solutions</h3>
  <div style="display:flex;flex-direction:column;gap:12px">${t.qs.map((q,k)=>{ const st=status(k), m=marks(k);
    return `<div class="wk-rv ${st}"><p class="mjx" style="margin:0"><b>Q${k+1}.</b> ${q.q}</p>
      <div class="wk-row"><span class="pill ${st==="ok"?"ok":st==="bad"?"bad":""}">${m>0?"+"+fs2(m):m<0?"−"+fs2(-m):"0"}</span>
      <span>Your answer: <span class="mjx">${ansText(k,W.ans[k])}</span></span>
      <span>Correct: <span class="mjx">${q.t==="msq"?q.a.map(x=>KEYS[x]).join(", "):KEYS[q.a]+". "+q.o[q.a]}</span></span></div>
      <p class="hint mjx" style="margin:8px 0 0">${q.s}</p></div>`; }).join("")}</div>`;
}
function rankHTML(){
  const t=T(), me=uid(); let b;
  if(W.rows===null) b=`<p class="hint" style="padding:24px;text-align:center">Loading the rank list…</p>`;
  else if(!W.rows.length) b=`<p class="hint" style="padding:24px;text-align:center"><b style="color:var(--ink)">No attempts yet.</b> The first student to submit will appear here, ranked by marks and then by time.</p>`;
  else b=`<div class="tblwrap"><table><thead><tr><th>Rank</th><th>Name</th><th style="text-align:right">Marks</th><th style="text-align:right">Sec A</th><th style="text-align:right">Sec B</th><th style="text-align:right">Time</th></tr></thead><tbody>
    ${W.rows.map((r,k)=>`<tr ${r.id===me?'style="background:var(--gold-soft)"':""}><td><b>${k+1}</b></td><td>${esc(r.name||"Student")}${r.id===me?' <span class="pill gold">you</span>':""}</td><td style="text-align:right">${fs2(r.score)}</td><td style="text-align:right">${fs2(r.secA||0)}</td><td style="text-align:right">${fs2(r.secB||0)}</td><td style="text-align:right">${fmt(r.timeSec)}</td></tr>`).join("")}</tbody></table></div>`;
  return `<div class="panel"><div class="panel-head"><h3>Rank list · ${esc(t.title)}</h3><span class="hint">${W.rows&&W.rows.length?W.rows.length+(W.rows.length===1?" student":" students")+" · best attempt each":"Ties broken by shorter time"}</span></div>${b}</div>
    ${W.phase==="start"?`<div><button class="btn ghost" data-wtab="test">Back to the test</button></div>`:""}`;
}

function draw(){ const el=$("#wk"); if(!el) return; el.innerHTML=body(); bind(el); typeset(el); }
function persist(){ if(W.phase==="test") store.set(saveKey(),{ start:W.start, ans:W.ans, mk:W.mk, cur:W.cur, ord:W.qs?qsOrder(W.qs):null }); }
function startTick(){ clearInterval(tick); tick=setInterval(()=>{
  if(W.phase!=="test"){ clearInterval(tick); return; }
  const r=remaining(); ["#wkTimer","#wkTimer2"].forEach(sel=>{ const el=$(sel); if(el){ el.textContent=fmt(r); el.classList.toggle("low",r<300); } });
  if(r<=0) submit();
},500); }
function begin(){
  const b=base(); W.qs=shuffleQs(b.qs); W.qsFor=b.id;
  const t=T(); Object.assign(W,{ phase:"test", ans:t.qs.map(q=>q.t==="msq"?[]:null), mk:t.qs.map(()=>false), cur:0, confirming:false, start:Date.now() });
  persist(); startTick(); draw(); window.scrollTo(0,0);
}
async function submit(){
  if(W.phase!=="test") return;
  clearInterval(tick);
  const t=T(); W.end=Math.min(Date.now(),W.start+t.minutes*60000); W.phase="result"; store.del(saveKey());
  W.msg=app.session.admin?"Teacher preview: not added to the rank list.":"Saving to the rank list…";
  if(ui.view==="weekly"){ draw(); window.scrollTo(0,0); }
  if(app.session.admin) return;
  const g=grade(), id=uid(); if(!id){ setMsg("You're signed out, so this score wasn't saved."); return; }
  const rec={ name:String(app.session.name||"Student").slice(0,60), score:Math.round(g.score*100)/100, secA:Math.round(g.secA*100)/100, secB:g.secB,
    correct:g.correct, wrong:g.wrong, timeSec:Math.round((W.end-W.start)/1000), at:new Date().toISOString() };
  try{
    const ref=app.db.doc("results/"+t.id+"/entries/"+id), prev=await ref.get(), p=prev.exists?prev.data():null;
    const attempts=(p&&p.attempts||0)+1;
    const better=!p||rec.score>p.score||(rec.score===p.score&&rec.timeSec<p.timeSec);
    if(better){ await ref.set({ ...rec, attempts }); setMsg(p?"New personal best, saved to the rank list.":"Saved to the rank list."); }
    else { await ref.set({ ...p, name:rec.name, attempts }); setMsg(`Your best of ${fs2(p.score)} stays on the rank list.`); }
  }catch(e){ setMsg("Couldn't reach the rank list just now. Your score above is still correct."); }
}
function setMsg(m){ W.msg=m; const el=$("#wkMsg"); if(el) el.textContent=m; }
function bind(el){
  el.querySelectorAll("[data-wtest]").forEach(b=>b.addEventListener("click",()=>{ if(W.test===b.dataset.wtest) return; Object.assign(W,{ test:b.dataset.wtest, phase:"start", qs:null, qsFor:null, msg:"" }); listen(); draw(); }));
  el.querySelectorAll("[data-wtab]").forEach(b=>b.addEventListener("click",()=>{ W.tab=b.dataset.wtab; draw(); }));
  el.querySelectorAll("[data-wq]").forEach(b=>b.addEventListener("click",()=>{ W.cur=+b.dataset.wq; persist(); draw(); }));
  el.querySelectorAll("[data-wk]").forEach(b=>b.addEventListener("click",()=>{
    const k=+b.dataset.wk, i=W.cur;
    if(T().qs[i].t==="msq"){ const a=W.ans[i]; W.ans[i]=a.includes(k)?a.filter(x=>x!==k):[...a,k].sort(); } else W.ans[i]=k;
    persist(); draw();
  }));
  el.querySelectorAll("[data-wgo]").forEach(b=>b.addEventListener("click",()=>{
    const a=b.dataset.wgo, i=W.cur, n=T().qs.length;
    if(a==="begin") return begin();
    if(a==="submit") return submit();
    if(a==="again"){ W.phase="start"; W.tab="test"; }
    if(a==="clear") W.ans[i]=T().qs[i].t==="msq"?[]:null;
    if(a==="mark") W.mk[i]=!W.mk[i];
    if(a==="prev") W.cur--;
    if(a==="next"){ if(i<n-1) W.cur++; else W.confirming=true; }
    if(a==="confirm") W.confirming=true;
    if(a==="keep") W.confirming=false;
    persist(); draw();
  }));
}
window.vWeekly=vWeekly;
window.bindWeekly=()=>{ const el=$("#wk"); if(el){ bind(el); typeset(el); } };
window.weeklyTests=()=>WEEKLY.map(t=>({ id:t.id, sid:t.sid, max:maxOf(t), title:t.title }));
window.weeklyTitle=()=>WEEKLY[WEEKLY.length-1].title;
window.weeklyFacts=()=>{ const t=WEEKLY[WEEKLY.length-1]; return `${t.qs.length} questions · ${t.minutes} minutes · ${maxOf(t)} marks · MCQ + MSQ · batch rank list`; };
})();
