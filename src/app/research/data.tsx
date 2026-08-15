import { CaseStudy } from "./model";

export const caseStudies: CaseStudy[] = [
	{
		id: "lacunae",
		slug: "lacunae",
		title: "Lacunae",
		subtitle: "Accelerated MRI Reconstruction from Undersampled K-Space via U-Net",
		tagline:
			"Empirical study comparing k-space sampling patterns for accelerated MRI reconstruction across acceleration factors using a U-Net on fastMRI knee data.",
		status: "completed",
		tags: ["artificial-intelligence", "medicine", "mathematics"],
		year: 2025,
		methods: [
			"Random Cartesian Undersampling",
			"K-Space Masking (4x Acceleration)",
			"U-Net with Skip Connections",
			"L1 Reconstruction Loss",
			"SSIM / PSNR Evaluation",
			"Inverse FFT Baseline"
		],
		stack: ["Python", "PyTorch", "fastMRI", "h5py", "scikit-image", "wandb"],
		links: {
			repo: "https://github.com/bhavv04/lacunae"
		},
		hasCaseStudy: true
	},
	{
		id: "precursor",
		slug: "precursor",
		title: "Precursor",
		subtitle: "Cross-Asset Momentum Spillover from Commodities to Sector Equities via Granger Causality",
		tagline: "Tests whether commodity price momentum predicts sector equity moves 1–5 days ahead.",
		status: "in-progress",
		tags: ["finance", "economics", "mathematics"],
		year: 2025,
		methods: [
			"Granger Causality (F-test)",
			"Vector Autoregression (VAR)",
			"AIC Lag Selection",
			"Directed Acyclic Graph (DAG)",
			"Long/Short Backtest",
			"Sharpe Ratio & Max Drawdown"
		],
		stack: ["Python", "statsmodels", "networkx", "yfinance", "pandas", "matplotlib"],
		links: {
			repo: "https://github.com/bhavv04/precursor",
			SSRN: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7151398",
			paper: "https://bhavv04.github.io/precursor/precursor_paper.pdf"
		},
		hasCaseStudy: true
	},
	{
		id: "deadzones",
		slug: "deadzones",
		title: "Deadzones",
		subtitle: "Modeling the Seasonal Collapse and Recovery of Gulf Hypoxia from River Nutrient Loading",
		tagline: "40-year model tracing Gulf of Mexico dead zones back to Midwest agricultural runoff.",
		status: "completed",
		tags: ["climate", "geospatial", "mathematics"],
		year: 2025,
		methods: [
			"Random Forest Regression",
			"Leave-One-Out Cross Validation",
			"Pearson Correlation Analysis",
			"Anomaly Detection",
			"Time Series Feature Engineering",
			"NetCDF Oceanographic Processing",
			"Geospatial Visualization",
			"Sea Surface Temperature Analysis"
		],
		stack: ["Python", "xarray", "pandas", "scikit-learn", "matplotlib", "cartopy", "NumPy", "Jupyter", "NetCDF4"],
		links: {
			repo: "https://github.com/bhavv04/deadzone",
			SSRN: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7186418",
			paper: "https://bhavv04.github.io/deadzone/deadzone_paper.pdf"
		},
		hasCaseStudy: false
	},
	{
		id: "grokking",
		slug: "grokking",
		title: "Grokking",
		subtitle: "Reproducing Generalization Beyond Overfitting on Modular Arithmetic",
		tagline: "Reproduces the phenomenon where a transformer memorizes first, then suddenly generalizes.",
		status: "completed",
		tags: ["artificial-intelligence", "mathematics"],
		year: 2025,
		methods: [
			"Transformer (1-layer, 4-head)",
			"Modular Arithmetic Classification",
			"AdamW with High Weight Decay",
			"Train/Val Loss & Accuracy Tracking",
			"Grokking Epoch Detection"
		],
		stack: ["Python", "PyTorch", "matplotlib"],
		links: {
			repo: "https://gist.github.com/bhavv04/6389c05c23e9093a91c5cf63466ece7c"
		},
		hasCaseStudy: false
	},
	{
		id: "quantum-drug-binding",
		slug: "quantum-drug-binding",
		title: "Quantum Drug Binding",
		subtitle: "Predicting Small-Molecule Binding Affinity via Quantum Chemical Descriptors",
		tagline: "Uses quantum mechanical molecular descriptors to predict how tightly a drug binds to its target.",
		status: "in-progress",
		tags: ["artificial-intelligence", "medicine", "mathematics"],
		year: 2026,
		methods: [
			"Density Functional Theory (DFT)",
			"HOMO/LUMO Energy Extraction",
			"Molecular Electrostatic Potential",
			"Gradient Boosting Regression",
			"Pearson Correlation Analysis",
			"IC50 Label Processing"
		],
		stack: ["Python", "RDKit", "PySCF", "pandas", "scikit-learn", "matplotlib"],
		links: {
			repo: "https://github.com/bhavv04/quantum-drug-binding"
		},
		hasCaseStudy: false
	}
];
