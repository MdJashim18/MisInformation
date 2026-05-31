import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import {
    ShieldAlert, Brain, Layers, TrendingUp, Zap, BookOpen,
    ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle,
    ArrowLeft, Calendar, Database, BarChart3, Activity
} from 'lucide-react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

const DataDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = UseAxiosSecure();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [expandedCrit, setExpandedCrit] = useState(null);

    const CATS = ["VHR", "HR", "MR", "LR", "VLR"];
    const COLORS = {
        VHR: "#E63946", HR: "#F4A261", MR: "#2A9D8F",
        LR: "#457B9D", VLR: "#8338EC", Theta: "#ADB5BD",
    };
    const RISK_WEIGHT = { VHR: 4, HR: 3, MR: 2, LR: 1, VLR: 0 };

    useEffect(() => {
        if (location.state?.data) {
            setData(location.state.data);
            setLoading(false);
        } else if (id) {
            fetchDataById();
        } else {
            setError("No data ID provided");
            setLoading(false);
        }
    }, [id, location.state]);

    const fetchDataById = async () => {
        try {
            setLoading(true);
            const response = await axiosSecure.get(`/inputSurvey/${id}`);
            setData(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const topCat = (m) => {
        if (!m) return "N/A";
        return CATS.reduce((best, c) => (m[c] > m[best] ? c : best), CATS[0]);
    };

    const compositeScore = (ds, brb) => {
        if (!ds || !brb) return 0;
        return CATS.reduce(
            (s, c) => s + RISK_WEIGHT[c] * ((ds[c] + brb[c]) / 2), 0
        );
    };

    const pct = (v) => (v * 100).toFixed(2) + "%";
    const pctNum = (v) => parseFloat((v * 100).toFixed(2));

    const BADGE_STYLE = {
        VHR: { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
        HR: { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
        MR: { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0" },
        LR: { bg: "#DBEAFE", text: "#1E40AF", border: "#BFDBFE" },
        VLR: { bg: "#EDE9FE", text: "#4C1D95", border: "#DDD6FE" },
    };

    const Badge = ({ cat }) => {
        const s = BADGE_STYLE[cat] || BADGE_STYLE.MR;
        return (
            <span style={{
                background: s.bg, color: s.text,
                border: `1px solid ${s.border}`,
                padding: "2px 10px", borderRadius: 20,
                fontSize: 11, fontWeight: 600,
            }}>
                {cat}
            </span>
        );
    };

    const BeliefBar = ({ label, value, color, rank }) => {
        return (
            <div style={{
                display: "flex", alignItems: "center", gap: 8, padding: "5px 0",
                borderBottom: "1px solid #f1f5f9"
            }}>
                <span style={{ fontSize: 11, color: "#94a3b8", width: 14 }}>{rank}</span>
                <span style={{ fontSize: 12, color: "#475569", width: 36 }}>{label}</span>
                <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{
                        width: `${(value * 100).toFixed(1)}%`, height: 8,
                        background: color, borderRadius: 4,
                    }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", minWidth: 48, textAlign: "right" }}>
                    {pct(value)}
                </span>
            </div>
        );
    };

    const getVHRDominance = (resultsData) => {
        const altsList = Object.keys(resultsData);
        return altsList.map(alt => ({
            name: alt,
            dsVHR: pctNum(resultsData[alt]?.ds?.VHR || 0),
            brbVHR: pctNum(resultsData[alt]?.brb?.VHR || 0),
            avgVHR: pctNum(((resultsData[alt]?.ds?.VHR || 0) + (resultsData[alt]?.brb?.VHR || 0)) / 2)
        }));
    };

    if (loading) {
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: 300, gap: 12, color: "#64748b", fontFamily: "sans-serif"
            }}>
                <div style={{
                    width: 20, height: 20, border: "2px solid #e2e8f0",
                    borderTop: "2px solid #E63946", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                }} />
                Loading calculation details...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
                padding: "1rem 1.25rem", color: "#991B1B", fontFamily: "sans-serif",
                margin: "2rem"
            }}>
                <XCircle size={18} />
                <div>
                    <div style={{ fontWeight: 600 }}>Error loading data</div>
                    <div style={{ fontSize: 12 }}>{error}</div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: 300, color: "#64748b", fontFamily: "sans-serif"
            }}>
                <Database size={32} />
                <div style={{ marginLeft: 12 }}>No data found</div>
            </div>
        );
    }

    const results = data.calculatedResults;
    const metadata = data.metadata;
    const alts = metadata?.alternatives || ["Deepfake", "Fake News", "Voice Scam", "Phishing"];
    const criteriaNames = metadata?.criteria?.map(c => c.name) || [];

    // Prepare ranking data
    const ranked = alts
        .map(a => ({
            name: a,
            ds: results[a]?.ds,
            brb: results[a]?.brb,
            score: compositeScore(results[a]?.ds, results[a]?.brb),
        }))
        .sort((a, b) => b.score - a.score);

    const vhrData = getVHRDominance(results);

    const TH = {
        padding: "7px 10px", textAlign: "left", fontWeight: 600,
        color: "#64748b", borderBottom: "1px solid #e2e8f0", fontSize: 11,
    };
    const TD = { padding: "6px 10px", color: "#1e293b" };

    const TABS = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "combined", label: "Combined Results", icon: Activity },
        { id: "ds", label: "DS/ER Results", icon: Layers },
        { id: "brb", label: "BRB Results", icon: Brain },
        { id: "input", label: "Input Data", icon: Database },
    ];

    return (
        <div style={{
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            background: "#f8fafc", minHeight: "100vh", padding: "2rem"
        }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Header with Back Button */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 16,
                    marginBottom: 24, flexWrap: "wrap"
                }}>
                    <button
                        onClick={() => navigate('/CalculatedData')}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "8px 16px", background: "#fff",
                            border: "1px solid #e2e8f0", borderRadius: 8,
                            cursor: "pointer", color: "#64748b"
                        }}>
                        <ArrowLeft size={16} />
                        Back to List
                    </button>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                            {metadata?.title || "Risk Analysis Details"}
                        </h1>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                                <Calendar size={12} />
                                Calculated: {formatDate(data.calculatedAt)}
                            </span>
                            <Badge cat={topCat(ranked[0]?.ds)} />
                            <span style={{ fontSize: 12, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
                                <CheckCircle size={12} />
                                Status: Calculated
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tab Bar */}
                <div style={{
                    display: "flex", gap: 4, marginBottom: 20,
                    background: "#fff", borderRadius: 12, padding: "4px",
                    border: "1px solid #e2e8f0", flexWrap: "wrap"
                }}>
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "8px 16px", fontSize: 13, fontWeight: isActive ? 600 : 400,
                                    color: isActive ? "#E63946" : "#64748b",
                                    background: isActive ? "#FFF1F2" : "transparent",
                                    border: "none", borderRadius: 8, cursor: "pointer",
                                    flex: 1, justifyContent: "center"
                                }}>
                                <Icon size={14} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "1.5rem" }}>
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                                Final Risk Ranking
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                                {ranked.map((item, i) => {
                                    const medals = ["🥇", "🥈", "🥉", "4️⃣"];
                                    const tc = topCat(item.ds);
                                    return (
                                        <div key={item.name} style={{
                                            display: "flex", alignItems: "center", gap: 12,
                                            background: i === 0 ? "#FFF1F2" : "#f8fafc",
                                            border: `1px solid ${i === 0 ? "#FECACA" : "#e2e8f0"}`,
                                            borderRadius: 10, padding: "12px 16px",
                                        }}>
                                            <span style={{ fontSize: 24 }}>{medals[i]}</span>
                                            <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", flex: 1 }}>
                                                {item.name}
                                            </span>
                                            <Badge cat={tc} />
                                            <div style={{ fontSize: 12, color: "#64748b", minWidth: 160, textAlign: "right" }}>
                                                Score: <b style={{ color: "#E63946", fontSize: 14 }}>{item.score.toFixed(4)}</b>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                                Detailed Results by Alternative
                            </h2>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                    <thead>
                                        <tr style={{ background: "#f8fafc" }}>
                                            <th style={TH}>Alternative</th>
                                            {CATS.map(c => <th key={c} style={{ ...TH, color: COLORS[c] }}>{c} (DS/ER)</th>)}
                                            {CATS.map(c => <th key={`brb-${c}`} style={{ ...TH, color: COLORS[c] }}>{c} (BRB)</th>)}
                                            <th style={TH}>DS Decision</th>
                                            <th style={TH}>BRB Decision</th>
                                            <th style={TH}>Combined Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alts.map(alt => {
                                            const ds = results[alt]?.ds;
                                            const brb = results[alt]?.brb;
                                            return (
                                                <tr key={alt} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                                    <td style={{ ...TD, fontWeight: 600 }}>{alt}</td>
                                                    {CATS.map(c => <td key={c} style={TD}>{pct(ds?.[c] || 0)}</td>)}
                                                    {CATS.map(c => <td key={`brb-${c}`} style={TD}>{pct(brb?.[c] || 0)}</td>)}
                                                    <td style={TD}><Badge cat={topCat(ds)} /></td>
                                                    <td style={TD}><Badge cat={topCat(brb)} /></td>
                                                    <td style={{ ...TD, fontWeight: 700, color: COLORS.VHR }}>
                                                        {compositeScore(ds, brb).toFixed(4)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* COMBINED RESULTS TAB */}
                    {activeTab === "combined" && (
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                                Combined DS/ER + BRB Analysis
                            </h2>

                            {/* Combined Decision Summary */}
                            <div style={{
                                background: "#f8fafc", borderRadius: 10, padding: "1rem",
                                marginBottom: 20, border: "1px solid #e2e8f0"
                            }}>
                                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                    Decision Agreement Analysis
                                </h3>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                                    {alts.map(alt => {
                                        const dsDec = topCat(results[alt]?.ds);
                                        const brbDec = topCat(results[alt]?.brb);
                                        const agree = dsDec === brbDec;
                                        return (
                                            <div key={alt} style={{
                                                background: "#fff", borderRadius: 8,
                                                padding: "10px", border: "1px solid #e2e8f0"
                                            }}>
                                                <div style={{ fontWeight: 600, marginBottom: 8 }}>{alt}</div>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                    <span style={{ fontSize: 11, color: "#64748b" }}>DS/ER Decision:</span>
                                                    <Badge cat={dsDec} />
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                    <span style={{ fontSize: 11, color: "#64748b" }}>BRB Decision:</span>
                                                    <Badge cat={brbDec} />
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, paddingTop: 6, borderTop: "1px solid #e2e8f0" }}>
                                                    <span style={{ fontSize: 11, color: "#64748b" }}>Agreement:</span>
                                                    <span style={{ fontSize: 11, color: agree ? "#16a34a" : "#d97706", display: "flex", alignItems: "center", gap: 4 }}>
                                                        {agree ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                                        {agree ? "Yes" : "No"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* VHR Dominance Table */}
                            <div style={{
                                background: "#f8fafc", borderRadius: 10, padding: "1rem",
                                marginBottom: 20, border: "1px solid #e2e8f0"
                            }}>
                                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                    VHR Dominance Across Alternatives
                                </h3>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr style={{ background: "#e2e8f0" }}>
                                                <th style={TH}>Alternative</th>
                                                <th style={TH}>DS/ER VHR</th>
                                                <th style={TH}>BRB VHR</th>
                                                <th style={TH}>Average VHR</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vhrData.map(item => (
                                                <tr key={item.name} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                                    <td style={TD}>{item.name}</td>
                                                    <td style={{ ...TD, color: COLORS.VHR, fontWeight: 500 }}>{item.dsVHR.toFixed(2)}%</td>
                                                    <td style={{ ...TD, color: COLORS.HR, fontWeight: 500 }}>{item.brbVHR.toFixed(2)}%</td>
                                                    <td style={{ ...TD, color: COLORS.VHR, fontWeight: 700 }}>{item.avgVHR.toFixed(2)}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Per-Criterion Combined Results */}
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                Per-Criterion Combined Results
                            </h3>
                            {criteriaNames.map((critName, idx) => {
                                const isExpanded = expandedCrit === idx;
                                return (
                                    <div key={critName} style={{
                                        border: "1px solid #e2e8f0", borderRadius: 10,
                                        marginBottom: 10, overflow: "hidden"
                                    }}>
                                        <div
                                            onClick={() => setExpandedCrit(isExpanded ? null : idx)}
                                            style={{
                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                padding: "10px 14px", cursor: "pointer",
                                                background: isExpanded ? "#f8fafc" : "#fff"
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <span style={{ fontSize: 13, fontWeight: 500 }}>{critName}</span>
                                                {results[alts[0]]?.critResults?.[critName] && (
                                                    <Badge cat={topCat(results[alts[0]].critResults[critName].ds)} />
                                                )}
                                            </div>
                                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </div>
                                        
                                        {isExpanded && (
                                            <div style={{ padding: "12px 14px", borderTop: "1px solid #e2e8f0" }}>
                                                <div style={{ overflowX: "auto" }}>
                                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                                                        <thead>
                                                            <tr style={{ background: "#f8fafc" }}>
                                                                <th style={TH}>Alternative</th>
                                                                <th style={TH}>DS/ER Top</th>
                                                                <th style={TH}>BRB Top</th>
                                                                <th style={TH}>Combined Score</th>
                                                                <th style={TH}>Agreement</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {alts.map(alt => {
                                                                const ds = results[alt]?.critResults?.[critName]?.ds;
                                                                const brb = results[alt]?.critResults?.[critName]?.brb;
                                                                const dsTop = topCat(ds);
                                                                const brbTop = topCat(brb);
                                                                const score = compositeScore(ds, brb);
                                                                return (
                                                                    <tr key={alt} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                                                        <td style={TD}>{alt}</td>
                                                                        <td style={TD}><Badge cat={dsTop} /></td>
                                                                        <td style={TD}><Badge cat={brbTop} /></td>
                                                                        <td style={{ ...TD, fontWeight: 500, color: COLORS.VHR }}>{score.toFixed(4)}</td>
                                                                        <td style={TD}>
                                                                            {dsTop === brbTop 
                                                                                ? <CheckCircle size={14} color="#16a34a" />
                                                                                : <AlertTriangle size={14} color="#d97706" />
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* DS/ER RESULTS TAB */}
                    {activeTab === "ds" && (
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                                DS/ER Algorithm Results
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                                {alts.map(alt => {
                                    const ds = results[alt]?.ds;
                                    const seq = CATS.map(c => ({ cat: c, val: ds?.[c] || 0 })).sort((a, b) => b.val - a.val);
                                    return (
                                        <div key={alt} style={{
                                            background: "#f8fafc", borderRadius: 10, padding: "1rem",
                                            border: "1px solid #e2e8f0"
                                        }}>
                                            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{alt}</h3>
                                            {seq.map((item, i) => (
                                                <BeliefBar key={item.cat} rank={i + 1} label={item.cat}
                                                    value={item.val} color={COLORS[item.cat]} />
                                            ))}
                                            <div style={{ marginTop: 8, fontSize: 11, color: "#94a3b8" }}>
                                                Ignorance Θ = {pct(ds?.Theta || 0)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* BRB RESULTS TAB */}
                    {activeTab === "brb" && (
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                                BRB Model Results
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                                {alts.map(alt => {
                                    const brb = results[alt]?.brb;
                                    const seq = CATS.map(c => ({ cat: c, val: brb?.[c] || 0 })).sort((a, b) => b.val - a.val);
                                    return (
                                        <div key={alt} style={{
                                            background: "#f8fafc", borderRadius: 10, padding: "1rem",
                                            border: "1px solid #e2e8f0"
                                        }}>
                                            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{alt}</h3>
                                            {seq.map((item, i) => (
                                                <BeliefBar key={item.cat} rank={i + 1} label={item.cat}
                                                    value={item.val} color={COLORS[item.cat]} />
                                            ))}
                                            <div style={{ marginTop: 8, fontSize: 11, color: "#94a3b8" }}>
                                                Ignorance Θ = {pct(brb?.Theta || 0)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* INPUT DATA TAB */}
                    {activeTab === "input" && (
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                                Input Survey Data
                            </h2>
                            
                            {/* Criteria Weights */}
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                    Criteria Weights
                                </h3>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                                    {metadata?.criteria?.map(crit => (
                                        <div key={crit.id} style={{
                                            background: "#f8fafc", padding: "8px 12px",
                                            borderRadius: 6, border: "1px solid #e2e8f0"
                                        }}>
                                            <span style={{ fontWeight: 500 }}>{crit.name}</span>
                                            <span style={{ marginLeft: 8, color: "#E63946", fontWeight: 600 }}>
                                                {crit.weight}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sub-criteria and Beliefs */}
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                Sub-criteria Belief Degrees
                            </h3>
                            {metadata?.criteria?.map(crit => (
                                <div key={crit.id} style={{ marginBottom: 20 }}>
                                    <h4 style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8 }}>
                                        {crit.name}
                                    </h4>
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                                            <thead>
                                                <tr style={{ background: "#f8fafc" }}>
                                                    <th style={TH}>Sub-criterion</th>
                                                    <th style={TH}>Weight</th>
                                                    {alts.map(alt => <th key={alt} style={TH}>{alt}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {crit.subCriteria?.map(sub => (
                                                    <tr key={sub.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                                        <td style={TD}>{sub.name}</td>
                                                        <td style={TD}>{sub.weight}</td>
                                                        {alts.map(alt => {
                                                            const beliefs = sub.beliefs?.[alt];
                                                            return (
                                                                <td key={alt} style={TD}>
                                                                    {beliefs ? (
                                                                        <div>
                                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                                                                {CATS.map(c => (
                                                                                    <span key={c} style={{ fontSize: 10 }}>
                                                                                        <span style={{ color: COLORS[c] }}>{c}:</span>
                                                                                        <span> {pct(beliefs[c])}</span>
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                            <div style={{ marginTop: 4 }}>
                                                                                <Badge cat={topCat(beliefs)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : "N/A"}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataDetails;