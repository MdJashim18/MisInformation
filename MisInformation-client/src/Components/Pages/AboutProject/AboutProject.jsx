import React from 'react';
import {
    ShieldAlert, Brain, Layers, TrendingUp, BookOpen,
    CheckCircle, Database, BarChart3, Activity,
    Mail, Cpu, Network, Target,
    Award, Users
} from 'lucide-react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { FaFacebook } from 'react-icons/fa';

const AboutProject = () => {
    const axiosSecure = UseAxiosSecure();

    const GitHubIcon = () => (
        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
    const LinkedInIcon = () => (
        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );

    const features = [
        {
            icon: <Brain className="w-8 h-8 text-[#E63946]" />,
            title: "Dempster-Shafer Theory (DS/ER)",
            description: "Evidence combination using Dempster's rule with conflict coefficient calculation. Recursively aggregates 20 sub-criteria across 5 risk grades."
        },
        {
            icon: <Layers className="w-8 h-8 text-[#2A9D8F]" />,
            title: "Belief Rule-Based (BRB) Model",
            description: "Expert-assigned rule weights with ignorance factor θ = 1 − Σβᵢ. Normalization factor μ ensures valid probability distribution."
        },
        {
            icon: <Activity className="w-8 h-8 text-[#F4A261]" />,
            title: "Combined Intelligence",
            description: "Fusion of DS/ER and BRB algorithms provides robust risk assessment with cross-validation and agreement analysis."
        },
        {
            icon: <Database className="w-8 h-8 text-[#8338EC]" />,
            title: "MongoDB Integration",
            description: "Complete data persistence with CRUD operations. Survey data and calculation results stored securely in the cloud."
        },
        {
            icon: <BarChart3 className="w-8 h-8 text-[#457B9D]" />,
            title: "Interactive Visualizations",
            description: "Dynamic charts including Radar charts, Stacked Bar charts, and VHR Dominance analysis for comprehensive risk profiling."
        },
        {
            icon: <Target className="w-8 h-8 text-[#E63946]" />,
            title: "5 Risk Grades",
            description: "VHR (Very High Risk), HR (High Risk), MR (Medium Risk), LR (Low Risk), VLR (Very Low Risk) with utility weights 4→0."
        }
    ];

    const technologies = [
        { name: "React.js", color: "#61DAFB", description: "Frontend framework with hooks and context API" },
        { name: "Node.js + Express", color: "#339933", description: "RESTful API backend server" },
        { name: "MongoDB", color: "#47A248", description: "NoSQL database for data persistence" },
        { name: "Recharts", color: "#22B8CF", description: "Data visualization library" },
        { name: "Tailwind CSS", color: "#06B6D4", description: "Utility-first CSS framework" },
        { name: "Axios", color: "#5A29E4", description: "HTTP client for API requests" }
    ];

    const hierarchyStructure = [
        { level: "Level 0", name: "Goal", items: ["Ranking AI-Generated Misinformation Risk (Highest → Lowest)"] },
        { level: "Level 1", name: "Main Criteria", items: ["Technical Feasibility", "Detection Difficulty", "Dissemination Potential", "Impact Severity", "Victim Susceptibility"] },
        { level: "Level 2", name: "Sub-criteria", items: ["4 per criterion × 5 = 20 total sub-criteria"] },
        { level: "Level 3", name: "Alternatives", items: ["Deepfake", "Fake News", "Voice Scam", "Phishing"] }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
                        <ShieldAlert className="w-12 h-12 text-[#E63946]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        AI-Generated Misinformation
                        <span className="text-[#E63946]"> Risk Analysis Engine</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        A comprehensive decision support system combining DS/ER (Dempster-Shafer / Evidential Reasoning)
                        and BRB (Belief Rule-Based) algorithms for multi-criteria risk assessment.
                    </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                    {[
                        { number: "5", label: "Main Criteria", color: "bg-red-100" },
                        { number: "20", label: "Sub-criteria", color: "bg-green-100" },
                        { number: "4", label: "Alternatives", color: "bg-orange-100" },
                        { number: "5", label: "Risk Grades", color: "bg-blue-100" },
                        { number: "2", label: "Algorithms", color: "bg-purple-100" }
                    ].map((stat, idx) => (
                        <div key={idx} className={`${stat.color} rounded-xl p-4 text-center shadow-sm`}>
                            <div className="text-3xl font-bold text-gray-800">{stat.number}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Project Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-[#E63946]" />
                        Project Overview
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        This project implements a sophisticated risk analysis engine designed to evaluate and rank
                        AI-generated misinformation threats. The system utilizes a hierarchical decision structure
                        with 5 main criteria and 20 sub-criteria, processed through two complementary algorithms:
                        <strong> DS/ER (Dempster-Shafer / Evidential Reasoning)</strong> and
                        <strong> BRB (Belief Rule-Based) Model</strong>.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        The application provides a complete workflow from data input through MongoDB,
                        automated algorithm execution, result persistence, and interactive visualization.
                        Decision makers can analyze risk profiles, compare algorithm outputs, and make
                        informed decisions based on combined intelligence from both analytical methods.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                                <div className="mb-3">{feature.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Algorithm Methodology */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* DS/ER Algorithm */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Layers className="w-7 h-7 text-[#E63946]" />
                            <h3 className="text-xl font-bold text-gray-800">DS/ER Algorithm</h3>
                        </div>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-[#E63946]">Step 1:</span>
                                <span>Collect belief degrees for each sub-criterion across 5 risk grades (VHR→VLR)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-[#E63946]">Step 2:</span>
                                <span>Compute conflict K = Σ m₁(A)·m₂(B) for all A≠B pairs</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-[#E63946]">Step 3:</span>
                                <span>Calculate unnormalized combined mass: m(A) = m₁(A)·m₂(A) + m₁(A)·m₂(Θ) + m₁(Θ)·m₂(A)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-[#E63946]">Step 4:</span>
                                <span>Normalize: m(A) = m(A) / (1−K) to remove conflict</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-[#E63946]">Step 5:</span>
                                <span>Recursively combine all 20 sub-criteria for final belief distribution</span>
                            </div>
                        </div>
                    </div>

                    {/* BRB Algorithm */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Brain className="w-7 h-7 text-[#2A9D8F]" />
                            <h3 className="text-xl font-bold text-gray-800">BRB Model</h3>
                        </div>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-[#2A9D8F]">Step 1:</span>
                                <span>Assign rule weights αₖ = wₖ / Σwₖ for each sub-criterion</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-[#2A9D8F]">Step 2:</span>
                                <span>Compute weighted belief: w·β(A)ₖ = αₖ × β(A)ₖ</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-[#2A9D8F]">Step 3:</span>
                                <span>Calculate BRB score: S(A) = Π(w·β(A)ₖ + w·Θₖ) − Π(w·Θₖ)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-[#2A9D8F]">Step 4:</span>
                                <span>Compute normalization factor μ = Σ S(A) + Π(w·Θₖ)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-[#2A9D8F]">Step 5:</span>
                                <span>Final belief β(A) = S(A)/μ for each risk grade</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hierarchical Structure */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Network className="w-6 h-6 text-[#F4A261]" />
                        Hierarchical Decision Structure
                    </h2>
                    <div className="space-y-4">
                        {hierarchyStructure.map((level, idx) => (
                            <div key={idx} className="flex flex-wrap items-start gap-4 p-3 bg-gray-50 rounded-lg">
                                <div className="w-28">
                                    <span className="font-bold text-[#E63946]">{level.level}</span>
                                    <span className="text-xs text-gray-500 block">{level.name}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2">
                                        {level.items.map((item, i) => (
                                            <span key={i} className="bg-white px-3 py-1 rounded-full text-sm shadow-sm border border-gray-200">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Grades */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-[#8338EC]" />
                        Risk Grade Definitions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { grade: "VHR", name: "Very High Risk", weight: 4, color: "bg-red-100", desc: "Requires immediate intervention; extreme threat level" },
                            { grade: "HR", name: "High Risk", weight: 3, color: "bg-orange-100", desc: "Significant concern; demands close monitoring" },
                            { grade: "MR", name: "Medium Risk", weight: 2, color: "bg-green-100", desc: "Moderate concern; standard precautions apply" },
                            { grade: "LR", name: "Low Risk", weight: 1, color: "bg-blue-100", desc: "Minor concern; awareness sufficient" },
                            { grade: "VLR", name: "Very Low Risk", weight: 0, color: "bg-purple-100", desc: "Negligible threat; routine operations continue" }
                        ].map(risk => (
                            <div key={risk.grade} className={`${risk.color} rounded-xl p-4 text-center`}>
                                <div className="text-2xl font-bold">{risk.grade}</div>
                                <div className="text-xs text-gray-700 font-medium">{risk.name}</div>
                                <div className="text-sm font-bold mt-1">Weight: {risk.weight}</div>
                                <div className="text-xs text-gray-600 mt-2">{risk.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technologies Used */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Cpu className="w-6 h-6 text-[#E63946]" />
                        Technologies Used
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {technologies.map((tech, idx) => (
                            <div key={idx} className="text-center p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${tech.color}20` }}>
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tech.color }}></div>
                                </div>
                                <div className="font-semibold text-gray-800 text-sm">{tech.name}</div>
                                <div className="text-xs text-gray-500 mt-1">{tech.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Capabilities */}
                <div className="bg-gradient-to-r from-[#E63946] to-[#F4A261] rounded-2xl shadow-lg p-8 text-white mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Award className="w-7 h-7" />
                        System Capabilities
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Real-time risk calculation for 4 threat types</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Dual-algorithm validation (DS/ER + BRB)</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> MongoDB data persistence with CRUD operations</li>
                        </ul>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Interactive charts (Radar, Bar, Stacked)</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Agreement analysis between algorithms</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Responsive design with Tailwind CSS</li>
                        </ul>
                    </div>
                </div>

                {/* Developer Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Users className="w-6 h-6 text-[#E63946]" />
                        <h2 className="text-xl font-bold text-gray-800">Developed By</h2>
                    </div>
                    <p className="text-gray-700">
                        <strong>Mohammad Jashimuddin Rubel</strong>
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        A comprehensive solution for AI-generated misinformation risk assessment using advanced evidential reasoning techniques.
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                        <a href="https://github.com/MdJashim18" target="_blank" rel="noopener noreferrer"
                            className="p-2 bg-gray-800 rounded-full hover:bg-[#E63946] transition-colors">
                            <GitHubIcon />
                        </a>
                        <a href="https://www.linkedin.com/in/mohammadjashimuddinrubel/" target="_blank" rel="noopener noreferrer"
                            className="p-2 bg-blue-700 rounded-full hover:bg-[#E63946] transition-colors">
                            <LinkedInIcon />
                        </a>
                        
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutProject;