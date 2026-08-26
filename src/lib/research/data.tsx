// lib/research/data.ts
import type { CaseStudy } from "./model";

export const caseStudies: CaseStudy[] = [
	{
		id: "lacunae",
		title: "Lacunae",
		subtitle: "Accelerated MRI Reconstruction from Undersampled K-Space via U-Net",
		tagline: "U-Net that reconstructs full MRI scans from 25% of the frequency data.",
		abstract:
			"MRI acquisition is slow because it requires dense sampling of k-space, the frequency-domain representation of the scan. Lacunae artificially undersamples k-space at 4x acceleration - retaining only 25% of frequency lines - and trains a U-Net to reconstruct diagnostically useful images from the incomplete data. A naive inverse FFT on undersampled k-space produces severe aliasing artifacts; the model learns to recover the missing structure. Trained on the fastMRI single-coil knee dataset with L1 loss and evaluated on SSIM and PSNR.",
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
		stack: ["Python", "pandas", "statsmodels", "matplotlib", "PyTorch"],
		links: {
			repo: "https://github.com/bhavv04/lacunae"
		},
		highlights: [
			"Center 8% of k-space columns always retained - low frequencies carry the bulk of image energy",
			"~7.7M parameter U-Net with four encoder/decoder stages and transposed convolution upsampling",
			"Benchmarked on NYU fastMRI single-coil knee dataset (Zbontar et al., 2018)"
		],
		hasCaseStudy: true,
		slug: "lacunae"
	},
	{
		id: "precursor",
		title: "Precursor",
		subtitle: "Cross-Asset Momentum Spillover from Commodities to Sector Equities via Granger Causality",
		tagline: "Tests whether commodity price momentum predicts sector equity moves 1–5 days ahead.",
		abstract:
			"Commodities are upstream inputs to the businesses that consume them. This project investigates whether commodity momentum statistically precedes sector equity momentum, quantifies the lag structure across 1–5 trading days, and tests whether that predictive precedence is exploitable as a long/short trading signal. Granger causality tests, VAR estimation, and a DAG-based causal graph are applied across five commodity–equity pairs including WTI→XLE, Copper→XLB, and Gold→GDX.",
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
		stack: ["Python", "statsmodels", "networkx", "yfinance", "pandas", "matplotlib", "Jupyter", "Statsmodels"],
		links: {
			repo: "https://github.com/bhavv04/precursor",
			paper: "https://bhavv04.github.io/precursor/precursor_paper.pdf",
			SSRN: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7151398"
		},
		highlights: [
			"Tests momentum spillover at lags k ∈ {1,2,3,4,5} trading days across 3,500+ daily observations",
			"DAG construction maps in/out-degree centrality to identify leading commodity indicators",
			"Backtest evaluates annualised Sharpe, max drawdown, and hit rate on an 80/20 train/test split"
		],
		hasCaseStudy: true,
		slug: "precursor"
	}
];
