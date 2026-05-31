/**
 * ============================================================
 *  AI-Generated Misinformation Risk Analysis Engine
 *  DS/ER (Dempster-Shafer / Evidential Reasoning) +
 *  BRB (Belief Rule-Based) Combined Algorithm
 * ============================================================
 */

import { useState, useEffect } from "react";
import {
    BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from "recharts";
import {
    ShieldAlert, Brain, Layers, BarChart2, BookOpen,
    ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Zap,
    CheckCircle, XCircle, Info,
} from "lucide-react";
import { MdOutlineInput } from "react-icons/md";
import { Link } from 'react-router';

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────
const CATS = ["VHR", "HR", "MR", "LR", "VLR"];
const CAT_LABELS = {
    VHR: "Very High Risk",
    HR: "High Risk",
    MR: "Medium Risk",
    LR: "Low Risk",
    VLR: "Very Low Risk",
};
const COLORS = {
    VHR: "#E63946",
    HR: "#F4A261",
    MR: "#2A9D8F",
    LR: "#457B9D",
    VLR: "#8338EC",
    Theta: "#ADB5BD",
};
const ALT_COLORS = ["#E63946", "#2A9D8F", "#F4A261", "#457B9D"];
const RISK_WEIGHT = { VHR: 4, HR: 3, MR: 2, LR: 1, VLR: 0 };

const BADGE_STYLE = {
    VHR: { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
    HR: { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
    MR: { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0" },
    LR: { bg: "#DBEAFE", text: "#1E40AF", border: "#BFDBFE" },
    VLR: { bg: "#EDE9FE", text: "#4C1D95", border: "#DDD6FE" },
};

// ─────────────────────────────────────────────────────────────
//  ALGORITHM 1 — DS/ER Combination Rule
// ─────────────────────────────────────────────────────────────
function dsAggregate(evidences) {
    let m = { ...evidences[0] };
    const sumFirst = CATS.reduce((s, c) => s + (m[c] || 0), 0);
    m.Theta = Math.max(0, 1 - sumFirst);

    for (let e = 1; e < evidences.length; e++) {
        const ev2 = evidences[e];
        const m2 = { ...ev2 };
        const sum2 = CATS.reduce((s, c) => s + (m2[c] || 0), 0);
        m2.Theta = Math.max(0, 1 - sum2);

        let K = 0;
        for (const ci of CATS)
            for (const cj of CATS)
                if (ci !== cj) K += (m[ci] || 0) * (m2[cj] || 0);

        const oneMinusK = Math.max(1e-9, 1 - K);

        const newM = {};
        for (const cat of CATS) {
            newM[cat] =
                (m[cat] || 0) * (m2[cat] || 0) +
                (m[cat] || 0) * m2.Theta +
                m.Theta * (m2[cat] || 0);
        }
        newM.Theta = m.Theta * m2.Theta;

        const total = CATS.reduce((s, c) => s + newM[c], 0) + newM.Theta;
        for (const k of [...CATS, "Theta"])
            newM[k] = (newM[k] / oneMinusK) / (total / oneMinusK);

        const resum = CATS.reduce((s, c) => s + newM[c], 0) + newM.Theta;
        for (const k of [...CATS, "Theta"]) newM[k] = newM[k] / resum;

        m = newM;
    }
    return m;
}

// ─────────────────────────────────────────────────────────────
//  ALGORITHM 2 — BRB (Belief Rule-Based) Model
// ─────────────────────────────────────────────────────────────
function brbAggregate(evidences, weights = null) {
    const n = evidences.length;
    const alphas = weights
        ? weights.map(w => w / weights.reduce((a, b) => a + b, 0))
        : evidences.map(() => 1 / n);

    const wBeliefs = evidences.map((ev, idx) => {
        const sum = CATS.reduce((s, c) => s + (ev[c] || 0), 0);
        const theta = Math.max(0, 1 - sum);
        const a = alphas[idx];
        const wb = {};
        for (const c of CATS) wb[c] = a * (ev[c] || 0);
        wb.Theta = a * theta;
        return wb;
    });

    let result = wBeliefs[0];
    for (let i = 1; i < wBeliefs.length; i++) {
        const w1 = result;
        const w2 = wBeliefs[i];
        const ignProd = w1.Theta * w2.Theta;
        const scores = {};
        for (const cat of CATS) {
            scores[cat] =
                (w1[cat] + w1.Theta) * (w2[cat] + w2.Theta) - ignProd;
        }
        const mu = CATS.reduce((s, c) => s + scores[c], 0) + ignProd;
        const newM = {};
        for (const cat of CATS) newM[cat] = scores[cat] / mu;
        newM.Theta = ignProd / mu;
        result = newM;
    }
    return result;
}

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
function topCat(m) {
    return CATS.reduce((best, c) => (m[c] > m[best] ? c : best), CATS[0]);
}
function compositeScore(ds, brb) {
    return CATS.reduce(
        (s, c) => s + RISK_WEIGHT[c] * ((ds[c] + brb[c]) / 2),
        0
    );
}
function pct(v) { return (v * 100).toFixed(2) + "%"; }
function pctNum(v) { return parseFloat((v * 100).toFixed(2)); }

function computeAll(data) {
    // Safety check
    if (!data || !data.metadata || !data.metadata.alternatives) {
        console.error("Invalid data in computeAll:", data);
        throw new Error("Invalid data structure");
    }
    
    const alts = data.metadata.alternatives;
    const results = {};

    for (const alt of alts) {
        const critResults = {};
        for (const crit of data.metadata.criteria) {
            const evs = crit.subCriteria.map(s => s.beliefs[alt]);
            const subWeights = crit.subCriteria.map(s => s.weight);
            critResults[crit.name] = {
                ds: dsAggregate(evs),
                brb: brbAggregate(evs, subWeights),
                subCriteria: crit.subCriteria.map(sub => ({
                    name: sub.name,
                    ds: dsAggregate([sub.beliefs[alt]]),
                    brb: brbAggregate([sub.beliefs[alt]]),
                    raw: sub.beliefs[alt],
                })),
            };
        }

        const critWeights = data.metadata.criteria.map(c => c.weight);
        const critDsEvs = data.metadata.criteria.map(c => critResults[c.name].ds);
        const critBrbEvs = data.metadata.criteria.map(c => critResults[c.name].brb);

        results[alt] = {
            ds: dsAggregate(critDsEvs),
            brb: brbAggregate(critBrbEvs, critWeights),
            critResults,
        };
    }
    return results;
}

// ─────────────────────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────
function Badge({ cat }) {
    const s = BADGE_STYLE[cat] || BADGE_STYLE.MR;
    return (
        <span style={{
            background: s.bg, color: s.text,
            border: `1px solid ${s.border}`,
            padding: "2px 10px", borderRadius: 20,
            fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
        }}>
            {cat}
        </span>
    );
}

function BeliefBar({ label, value, color, rank }) {
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
                    transition: "width 0.7s cubic-bezier(.4,0,.2,1)",
                }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", minWidth: 48, textAlign: "right" }}>
                {pct(value)}
            </span>
        </div>
    );
}

function AlgorithmResultPanel({ title, result, icon: Icon, color }) {
    const seq = CATS.map(c => ({ cat: c, val: result[c] }))
        .sort((a, b) => b.val - a.val);
    const top = seq[0].cat;

    return (
        <div style={{
            background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: 12, padding: "1.25rem",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Icon size={16} color={color} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{title}</span>
                <Badge cat={top} />
            </div>
            {seq.map((item, i) => (
                <BeliefBar key={item.cat} rank={i + 1} label={item.cat}
                    value={item.val} color={COLORS[item.cat]} />
            ))}
            <div style={{ marginTop: 10, fontSize: 11, color: "#94a3b8" }}>
                Ignorance Θ = {pct(result.Theta || 0)}
            </div>
        </div>
    );
}

function CriterionAccordion({ critName, critData }) {
    const [open, setOpen] = useState(false);
    const topDs = topCat(critData.ds);
    const topBrb = topCat(critData.brb);

    const TH = {
        padding: "7px 10px", textAlign: "left", fontWeight: 600,
        color: "#64748b", borderBottom: "1px solid #e2e8f0", fontSize: 11,
    };
    const TD = { padding: "6px 10px", color: "#1e293b" };

    return (
        <div style={{
            border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 8,
            overflow: "hidden",
        }}>
            <div
                onClick={() => setOpen(o => !o)}
                style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", cursor: "pointer", background: open ? "#f8fafc" : "#fff",
                    userSelect: "none",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#1e293b" }}>{critName}</span>
                    <Badge cat={topDs} />
                </div>
                {open ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
            </div>

            {open && (
                <div style={{ padding: "0 14px 14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                        <AlgorithmResultPanel title="DS/ER" result={critData.ds}
                            icon={Layers} color="#E63946" />
                        <AlgorithmResultPanel title="BRB" result={critData.brb}
                            icon={Brain} color="#457B9D" />
                    </div>

                    <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                        Sub-criteria Breakdown
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                            <thead>
                                <tr style={{ background: "#f8fafc" }}>
                                    <th style={TH}>Sub-criterion</th>
                                    {CATS.map(c => <th key={c} style={{ ...TH, color: COLORS[c] }}>{c}</th>)}
                                    <th style={TH}>DS Top</th>
                                    <th style={TH}>BRB Top</th>
                                </tr>
                            </thead>
                            <tbody>
                                {critData.subCriteria.map((sub, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={TD}>{sub.name}</td>
                                        {CATS.map(c => (
                                            <td key={c} style={{
                                                ...TD, fontWeight: sub.raw[c] > 0.3 ? 600 : 400,
                                                color: sub.raw[c] > 0.3 ? COLORS[c] : "#475569"
                                            }}>
                                                {pct(sub.raw[c])}
                                            </td>
                                        ))}
                                        <td style={TD}><Badge cat={topCat(sub.ds)} /></td>
                                        <td style={TD}><Badge cat={topCat(sub.brb)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
//  CHART COMPONENTS
// ─────────────────────────────────────────────────────────────
function StackedBeliefsChart({ results, algo }) {
    const alts = Object.keys(results);
    const data = alts.map(alt => {
        const m = results[alt][algo];
        return { name: alt, ...Object.fromEntries(CATS.map(c => [c, pctNum(m[c])])) };
    });
    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 10, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickFormatter={v => v + "%"} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip formatter={(v, n) => [v.toFixed(2) + "%", CAT_LABELS[n] || n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {CATS.map(c => (
                    <Bar key={c} dataKey={c} stackId="a" fill={COLORS[c]} name={c} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}

function RadarComparisonChart({ results, criteriaNames }) {
    const alts = Object.keys(results);
    const data = criteriaNames.map(crit => {
        const row = { criterion: crit.replace("&", "&") };
        alts.forEach(alt => {
            const ds = results[alt].critResults[crit]?.ds;
            const brb = results[alt].critResults[crit]?.brb;
            if (ds && brb) {
                row[alt] = parseFloat(
                    (CATS.reduce((s, c) => s + RISK_WEIGHT[c] * ((ds[c] + brb[c]) / 2), 0)).toFixed(3)
                );
            }
        });
        return row;
    });

    const shortName = n => {
        const map = {
            "Technical Feasibility of Creation": "Tech. Feasibility",
            "Detection Difficulty": "Detection Diff.",
            "Dissemination & Spread Potential": "Dissemination",
            "Severity of Potential Impact": "Severity",
            "Victim Susceptibility": "Victim Susc.",
        };
        return map[n] || n;
    };

    const chartData = data.map(d => ({ ...d, criterion: shortName(d.criterion) }));

    return (
        <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="criterion" tick={{ fontSize: 11, fill: "#64748b" }} />
                <PolarRadiusAxis angle={90} domain={[0, 3.5]}
                    tick={{ fontSize: 10, fill: "#94a3b8" }} tickCount={4} />
                {alts.map((alt, i) => (
                    <Radar key={alt} name={alt} dataKey={alt}
                        stroke={ALT_COLORS[i]} fill={ALT_COLORS[i]} fillOpacity={0.15}
                        strokeWidth={2} dot={{ r: 3 }} />
                ))}
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip formatter={v => v.toFixed(3)} />
            </RadarChart>
        </ResponsiveContainer>
    );
}

function CompositeBarChart({ results }) {
    const alts = Object.keys(results);
    const data = alts.map(alt => ({
        name: alt,
        DS_Score: parseFloat(CATS.reduce((s, c) => s + RISK_WEIGHT[c] * results[alt].ds[c], 0).toFixed(3)),
        BRB_Score: parseFloat(CATS.reduce((s, c) => s + RISK_WEIGHT[c] * results[alt].brb[c], 0).toFixed(3)),
        Combined: parseFloat(compositeScore(results[alt].ds, results[alt].brb).toFixed(3)),
    }));

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 10, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis domain={[0, 4]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="DS_Score" name="DS/ER Score" fill="#E63946" radius={[3, 3, 0, 0]} />
                <Bar dataKey="BRB_Score" name="BRB Score" fill="#457B9D" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Combined" name="Combined Score" fill="#2A9D8F" radius={[3, 3, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

function VHRDominanceChart({ results }) {
    const alts = Object.keys(results);
    const data = alts.map(alt => ({
        name: alt,
        "DS/ER VHR": pctNum(results[alt].ds.VHR),
        "BRB VHR": pctNum(results[alt].brb.VHR),
        "Avg VHR": parseFloat(((results[alt].ds.VHR + results[alt].brb.VHR) / 2 * 100).toFixed(2)),
    }));

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 10, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickFormatter={v => v + "%"} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip formatter={v => v.toFixed(2) + "%"} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="DS/ER VHR" fill="#E63946" radius={[3, 3, 0, 0]} />
                <Bar dataKey="BRB VHR" fill="#F4A261" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Avg VHR" fill="#8338EC" radius={[3, 3, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

// ─────────────────────────────────────────────────────────────
//  TABS
// ─────────────────────────────────────────────────────────────
const TABS = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "ds", label: "DS/ER", icon: Layers },
    { id: "brb", label: "BRB Model", icon: Brain },
    { id: "combined", label: "Combined", icon: Zap },
    { id: "methodology", label: "Methodology", icon: BookOpen },
];

// ─────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ApplyAlgorithm() {
    const [data, setData] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [activeAlt, setActiveAlt] = useState(0);
    const [isCalculated, setIsCalculated] = useState(false);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);

    // ── Function to update isCalculated status in backend ──
    const updateCalculatedStatus = async (dataId, status) => {
        try {
            const response = await fetch(`https://mis-information-server-api.vercel.app/inputSurvey/${dataId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isCalculated: status })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.status}`);
            }
            
            console.log(`isCalculated updated to: ${status}`);
            return await response.json();
        } catch (err) {
            console.error("Error updating calculated status:", err);
            return null;
        }
    };

    // ── Function to apply algorithm and save results ──
    const applyAlgorithmAndSave = async (rawData, dataId) => {
        try {
            console.log("Applying algorithm to data...");
            const computedResults = computeAll(rawData);
            
            // Save results to backend
            const saveResponse = await fetch(`https://mis-information-server-api.vercel.app/inputSurvey/${dataId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    isCalculated: true,
                    calculatedResults: computedResults,
                    calculatedAt: new Date().toISOString()
                })
            });
            
            if (!saveResponse.ok) {
                throw new Error(`Failed to save results: ${saveResponse.status}`);
            }
            
            console.log("Algorithm results saved successfully");
            return computedResults;
        } catch (err) {
            console.error("Error applying algorithm:", err);
            throw err;
        }
    };

    // ── Fetch JSON data from backend ──────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                setShowNoDataMessage(false);
                
                console.log("Fetching data from backend: https://mis-information-server-api.vercel.app/inputSurvey");
                const response = await fetch('https://mis-information-server-api.vercel.app/inputSurvey');
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                let json = await response.json();
                console.log("Raw response from backend:", json);
                
                // Process data - handle both array and object responses
                let processedData = null;
                let dataId = null;
                
                if (Array.isArray(json)) {
                    if (json.length === 0) {
                        throw new Error("No data found in inputSurvey collection. Please add data first.");
                    }
                    // Take the most recent data (last item)
                    processedData = json[json.length - 1];
                    dataId = processedData._id;
                    console.log("Extracted from array:", processedData);
                } else if (json && typeof json === 'object') {
                    processedData = json;
                    dataId = processedData._id;
                } else {
                    throw new Error("Invalid data format received from server");
                }
                
                // Validate data structure
                if (!processedData || !processedData.metadata) {
                    console.error("Invalid data structure:", processedData);
                    throw new Error("Metadata is missing in the response data");
                }
                
                if (!processedData.metadata.alternatives) {
                    throw new Error("Alternatives array is missing in metadata");
                }
                
                if (!processedData.metadata.criteria) {
                    throw new Error("Criteria array is missing in metadata");
                }
                
                console.log("Valid data found. Alternatives:", processedData.metadata.alternatives);
                console.log("isCalculated status:", processedData.isCalculated);
                
                // Check if data is already calculated
                if (processedData.isCalculated === true || processedData.isCalculated === "true") {
                    console.log("Data already calculated. Showing message to input new data.");
                    setIsCalculated(true);
                    setShowNoDataMessage(true);
                    setData(processedData);
                    // Don't set results - so no old results will be shown
                    setResults(null);
                } else {
                    console.log("Data not calculated yet. Applying algorithm...");
                    setIsCalculated(false);
                    setShowNoDataMessage(false);
                    
                    // Apply algorithm and save results
                    const computedResults = await applyAlgorithmAndSave(processedData, dataId);
                    setResults(computedResults);
                    setData({ ...processedData, isCalculated: true });
                    setIsCalculated(true);
                }
                
                setError(null);
                
            } catch (err) {
                console.error("Detailed fetch error:", err);
                setError(err.message);
                setData(null);
                setResults(null);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: 300, gap: 12, color: "#64748b", fontFamily: "sans-serif",
                flexDirection: "column"
            }}>
                <div style={{
                    width: 20, height: 20, border: "2px solid #e2e8f0",
                    borderTop: "2px solid #E63946", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                }} />
                Loading risk data from server...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
                padding: "1rem 1.25rem", color: "#991B1B", fontFamily: "sans-serif",
                margin: "2rem", flexDirection: "column", alignItems: "flex-start"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <XCircle size={18} />
                    <div style={{ fontWeight: 600 }}>Failed to load risk data</div>
                </div>
                <div style={{ fontSize: 12, marginTop: 2 }}>Error: {error}</div>
                <div style={{ fontSize: 12, marginTop: 4, color: "#b91c1c" }}>
                    Please ensure:
                    <ul style={{ marginTop: 4, marginLeft: 20 }}>
                        <li>Backend server is running on port 3000</li>
                        <li>MongoDB is connected successfully</li>
                        <li>Data exists in "inputSurvey" collection</li>
                    </ul>
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                        marginTop: 10,
                        padding: "6px 12px",
                        background: "#E63946",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer"
                    }}
                >
                    Reload Page
                </button>
            </div>
        );
    }

    // Show message when data is already calculated
    if (showNoDataMessage || (isCalculated && !results)) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                fontFamily: "sans-serif",
                padding: "2rem"
            }}>
                <div style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    padding: "2rem",
                    maxWidth: 500,
                    textAlign: "center",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}>
                    <div style={{
                        background: "#FEF3C7",
                        borderRadius: "50%",
                        width: 60,
                        height: 60,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem"
                    }}>
                        <AlertTriangle size={32} color="#D97706" />
                    </div>
                    <h2 style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: 8
                    }}>
                        No Uncalculated Data Available
                    </h2>
                    <p style={{
                        fontSize: 14,
                        color: "#64748b",
                        marginBottom: 16,
                        lineHeight: 1.5
                    }}>
                        The current data has already been calculated. Please input new data to run the algorithm again.
                    </p>
                    <Link to='/InputData'>
                        <button style={{
                            background: "#E63946",
                            color: "white",
                            border: "none",
                            padding: "10px 24px",
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            transition: "all 0.2s"
                        }}>
                            <MdOutlineInput size={18} />
                            Input New Data
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    // No data state (when there's no data at all in database)
    if (!data) {
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: 300, gap: 12, color: "#64748b", fontFamily: "sans-serif",
                flexDirection: "column"
            }}>
                <AlertTriangle size={32} />
                <div>No data available. Please add data to the database.</div>
                <Link to='/InputData'>
                    <button style={{
                        background: "#E63946",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: 6,
                        cursor: "pointer"
                    }}>
                        Go to Input Data
                    </button>
                </Link>
            </div>
        );
    }

    // Safe to render - data and results exist (only when results are calculated)
    if (!results) {
        return null; // This shouldn't happen due to the check above
    }

    const alts = data.metadata.alternatives;
    const criteriaNames = data.metadata.criteria.map(c => c.name);
    const alt = alts[activeAlt];
    const altResult = results[alt];

    // Final ranking by combined score
    const ranked = alts
        .map(a => ({
            name: a,
            ds: results[a].ds,
            brb: results[a].brb,
            score: compositeScore(results[a].ds, results[a].brb),
        }))
        .sort((a, b) => b.score - a.score);

    const TH = {
        padding: "7px 10px", textAlign: "left", fontWeight: 600,
        color: "#64748b", borderBottom: "1px solid #e2e8f0", fontSize: 11,
    };
    const TD = { padding: "6px 10px", color: "#1e293b" };

    // ─── render main content ────────────────────────────────────────────
    return (
        <div style={{
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            background: "#f8fafc", minHeight: "100vh", padding: "0 0 3rem",
        }}>
            {/* ── Header ── */}
            <div style={{
                background: "#fff", borderBottom: "1px solid #e2e8f0",
                padding: "1.25rem 2rem 1rem",
            }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{
                        background: "#FEE2E2", borderRadius: 10, padding: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <ShieldAlert size={22} color="#E63946" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                            AI-Generated Misinformation Risk Analysis
                        </h1>
                        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
                            DS/ER (Dempster-Shafer / Evidential Reasoning) + BRB (Belief Rule-Based) Combined Engine
                            &nbsp;·&nbsp; {alts.length} Alternatives &nbsp;·&nbsp; 5 Criteria &nbsp;·&nbsp; 20 Sub-criteria
                        </p>
                        {data.isCalculated && (
                            <p style={{ fontSize: 11, color: "#16a34a", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                <CheckCircle size={12} />
                                Status: Calculated ✓
                            </p>
                        )}
                    </div>
                </div>

                {/* Tab bar */}
                <div style={{ display: "flex", gap: 4, marginTop: 16, borderBottom: "none", flexWrap: "wrap" }}>
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "7px 14px", fontSize: 13, fontWeight: isActive ? 600 : 400,
                                    color: isActive ? "#E63946" : "#64748b",
                                    background: isActive ? "#FFF1F2" : "transparent",
                                    border: "none", borderRadius: 8, cursor: "pointer",
                                    transition: "all 0.15s",
                                }}>
                                <Icon size={14} />
                                {tab.label}
                            </button>
                        );
                    })}
                    <Link to='/InputData' style={{ 
                        border: "none", 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        gap: 6,
                        padding: "7px 14px",
                        fontSize: 13,
                        fontWeight: 400,
                        color: "#64748b",
                        background: "transparent",
                        borderRadius: 8,
                        cursor: "pointer",
                        textDecoration: "none",
                        transition: "all 0.15s"
                    }}>
                        <MdOutlineInput /> Input Data
                    </Link>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ padding: "1.5rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
                {/* ════════════════ OVERVIEW TAB ════════════════ */}
                {activeTab === "overview" && (
                    <div>
                        {/* KPI cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                            {[
                                { label: "Alternatives Analyzed", value: alts.length, sub: "Deepfake, Fake News, Voice Scam, Phishing" },
                                { label: "Main Criteria", value: 5, sub: "Hierarchical 3-level structure" },
                                { label: "Sub-criteria", value: 20, sub: "4 per main criterion" },
                                { label: "Risk Grades", value: CATS.length, sub: "VHR · HR · MR · LR · VLR" },
                            ].map(kpi => (
                                <div key={kpi.label} style={{
                                    background: "#fff", border: "1px solid #e2e8f0",
                                    borderRadius: 12, padding: "1rem 1.25rem",
                                }}>
                                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{kpi.label}</div>
                                    <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a" }}>{kpi.value}</div>
                                    <div style={{ fontSize: 11, color: "#64748b" }}>{kpi.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Final Ranking */}
                        <div style={{
                            background: "#fff", border: "1px solid #e2e8f0",
                            borderRadius: 12, padding: "1.25rem", marginBottom: 20,
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                <TrendingUp size={16} color="#E63946" />
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                                    Final Risk Ranking (DS/ER + BRB Combined)
                                </span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {ranked.map((item, i) => {
                                    const medals = ["🥇", "🥈", "🥉", "4️⃣"];
                                    const tc = topCat(item.ds);
                                    const avgVHR = ((item.ds.VHR + item.brb.VHR) / 2 * 100).toFixed(2);
                                    return (
                                        <div key={item.name} style={{
                                            display: "flex", alignItems: "center", gap: 12,
                                            background: i === 0 ? "#FFF1F2" : "#f8fafc",
                                            border: `1px solid ${i === 0 ? "#FECACA" : "#e2e8f0"}`,
                                            borderRadius: 10, padding: "10px 14px",
                                        }}>
                                            <span style={{ fontSize: 20 }}>{medals[i]}</span>
                                            <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", flex: 1 }}>
                                                {item.name}
                                            </span>
                                            <Badge cat={tc} />
                                            <div style={{ fontSize: 12, color: "#64748b", marginLeft: 8, minWidth: 160, textAlign: "right" }}>
                                                VHR avg: <b style={{ color: "#E63946" }}>{avgVHR}%</b>
                                                &emsp;Score: <b>{item.score.toFixed(4)}</b>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Composite score chart */}
                        <div style={{
                            background: "#fff", border: "1px solid #e2e8f0",
                            borderRadius: 12, padding: "1.25rem", marginBottom: 20,
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                Composite Risk Score — DS/ER vs BRB vs Combined
                            </div>
                            <CompositeBarChart results={results} />
                        </div>

                        {/* Radar */}
                        <div style={{
                            background: "#fff", border: "1px solid #e2e8f0",
                            borderRadius: 12, padding: "1.25rem",
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                Multi-criteria Risk Profile — Radar Chart
                            </div>
                            <RadarComparisonChart results={results} criteriaNames={criteriaNames} />
                        </div>
                    </div>
                )}

                {/* ════════════════ DS/ER TAB ════════════════ */}
                {activeTab === "ds" && (
                    <div>
                        <div style={{
                            background: "#FFF1F2", border: "1px solid #FECACA",
                            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                            display: "flex", gap: 8, alignItems: "flex-start",
                        }}>
                            <Info size={14} color="#E63946" style={{ marginTop: 1 }} />
                            <div style={{ fontSize: 12, color: "#7f1d1d" }}>
                                <b>Dempster-Shafer / Evidential Reasoning (DS/ER):</b> Evidence from all 20 sub-criteria
                                is recursively combined using Dempster's rule. Conflict coefficient K is computed at each
                                step. Final normalized belief degrees determine risk classification.
                            </div>
                        </div>

                        {/* Alternative selector */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                            {alts.map((a, i) => (
                                <button key={a} onClick={() => setActiveAlt(i)}
                                    style={{
                                        padding: "6px 16px", fontSize: 12, fontWeight: 500,
                                        border: `1px solid ${activeAlt === i ? "#E63946" : "#e2e8f0"}`,
                                        borderRadius: 20, cursor: "pointer",
                                        background: activeAlt === i ? "#E63946" : "#fff",
                                        color: activeAlt === i ? "#fff" : "#64748b",
                                    }}>
                                    {a}
                                </button>
                            ))}
                        </div>

                        {/* Full result */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                            <AlgorithmResultPanel title={`DS/ER — ${alt} (Overall)`}
                                result={altResult.ds} icon={Layers} color="#E63946" />
                            <div style={{
                                background: "#fff", border: "1px solid #e2e8f0",
                                borderRadius: 12, padding: "1.25rem",
                            }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                    DS/ER Belief Distribution (%)
                                </div>
                                <StackedBeliefsChart results={results} algo="ds" />
                            </div>
                        </div>

                        {/* Per-criterion accordion */}
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 10 }}>
                            Per-Criterion DS/ER Results — {alt}
                        </div>
                        {criteriaNames.map(cn => (
                            <CriterionAccordion key={cn} critName={cn}
                                critData={altResult.critResults[cn]} />
                        ))}

                        {/* VHR Dominance */}
                        <div style={{
                            background: "#fff", border: "1px solid #e2e8f0",
                            borderRadius: 12, padding: "1.25rem", marginTop: 16,
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                VHR Dominance — DS/ER across All Alternatives
                            </div>
                            <VHRDominanceChart results={results} />
                        </div>
                    </div>
                )}

                {/* ════════════════ BRB TAB ════════════════ */}
                {activeTab === "brb" && (
                    <div>
                        <div style={{
                            background: "#EFF6FF", border: "1px solid #BFDBFE",
                            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                            display: "flex", gap: 8, alignItems: "flex-start",
                        }}>
                            <Info size={14} color="#1E40AF" style={{ marginTop: 1 }} />
                            <div style={{ fontSize: 12, color: "#1e3a8a" }}>
                                <b>Belief Rule-Based (BRB) Model:</b> Expert-assigned rule weights (α) determine
                                contribution of each criterion. Ignorance θ = 1 − Σβᵢ. Normalization factor μ
                                ensures valid probability distribution. Final beliefs represent aggregated risk assessment.
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                            {alts.map((a, i) => (
                                <button key={a} onClick={() => setActiveAlt(i)}
                                    style={{
                                        padding: "6px 16px", fontSize: 12, fontWeight: 500,
                                        border: `1px solid ${activeAlt === i ? "#457B9D" : "#e2e8f0"}`,
                                        borderRadius: 20, cursor: "pointer",
                                        background: activeAlt === i ? "#457B9D" : "#fff",
                                        color: activeAlt === i ? "#fff" : "#64748b",
                                    }}>
                                    {a}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                            <AlgorithmResultPanel title={`BRB Model — ${alt} (Overall)`}
                                result={altResult.brb} icon={Brain} color="#457B9D" />
                            <div style={{
                                background: "#fff", border: "1px solid #e2e8f0",
                                borderRadius: 12, padding: "1.25rem",
                            }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                    BRB Belief Distribution (%)
                                </div>
                                <StackedBeliefsChart results={results} algo="brb" />
                            </div>
                        </div>

                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 10 }}>
                            Per-Criterion BRB Results — {alt}
                        </div>
                        {criteriaNames.map(cn => (
                            <CriterionAccordion key={cn} critName={cn}
                                critData={altResult.critResults[cn]} />
                        ))}
                    </div>
                )}

                {/* ════════════════ COMBINED TAB ════════════════ */}
                {activeTab === "combined" && (
                    <div>
                        {/* Decision summary grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 20 }}>
                            {alts.map((a) => {
                                const dsDec = topCat(results[a].ds);
                                const brbDec = topCat(results[a].brb);
                                const score = compositeScore(results[a].ds, results[a].brb);
                                const agree = dsDec === brbDec;
                                return (
                                    <div key={a} style={{
                                        background: "#fff", border: "1px solid #e2e8f0",
                                        borderRadius: 12, padding: "1rem 1.25rem",
                                    }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 10 }}>{a}</div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: 12, color: "#64748b" }}>DS/ER Decision</span>
                                                <Badge cat={dsDec} />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: 12, color: "#64748b" }}>BRB Decision</span>
                                                <Badge cat={brbDec} />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: 12, color: "#64748b" }}>Agreement</span>
                                                <span style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                                                    {agree
                                                        ? <><CheckCircle size={13} color="#16a34a" /> <span style={{ color: "#16a34a" }}>Yes</span></>
                                                        : <><AlertTriangle size={13} color="#d97706" /> <span style={{ color: "#d97706" }}>Divergent</span></>
                                                    }
                                                </span>
                                            </div>
                                            <div style={{
                                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                                paddingTop: 6, borderTop: "1px solid #f1f5f9"
                                            }}>
                                                <span style={{ fontSize: 12, color: "#64748b" }}>Combined Score</span>
                                                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.VHR }}>{score.toFixed(4)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Full ranking table */}
                        <div style={{
                            background: "#fff", border: "1px solid #e2e8f0",
                            borderRadius: 12, padding: "1.25rem", marginBottom: 20,
                            overflowX: "auto"
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                Final Risk Ranking Table
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 800 }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc" }}>
                                        <th style={TH}>Rank</th>
                                        <th style={TH}>Alternative</th>
                                        <th style={TH}>DS/ER VHR</th>
                                        <th style={TH}>BRB VHR</th>
                                        <th style={TH}>Avg VHR</th>
                                        <th style={TH}>DS/ER Score</th>
                                        <th style={TH}>BRB Score</th>
                                        <th style={TH}>Combined Score</th>
                                        <th style={TH}>DS Decision</th>
                                        <th style={TH}>BRB Decision</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ranked.map((item, i) => {
                                        const dsScore = CATS.reduce((s, c) => s + RISK_WEIGHT[c] * item.ds[c], 0);
                                        const brbScore = CATS.reduce((s, c) => s + RISK_WEIGHT[c] * item.brb[c], 0);
                                        const avgVHR = (item.ds.VHR + item.brb.VHR) / 2;
                                        return (
                                            <tr key={item.name} style={{
                                                background: i === 0 ? "#FFF1F2" : "transparent",
                                                borderBottom: "1px solid #f1f5f9",
                                            }}>
                                                <td style={{ ...TD, fontWeight: 700 }}>{i + 1}</td>
                                                <td style={{ ...TD, fontWeight: 600 }}>{item.name}</td>
                                                <td style={{ ...TD, color: COLORS.VHR }}>{pct(item.ds.VHR)}</td>
                                                <td style={{ ...TD, color: COLORS.VHR }}>{pct(item.brb.VHR)}</td>
                                                <td style={{ ...TD, fontWeight: 700, color: COLORS.VHR }}>{pct(avgVHR)}</td>
                                                <td style={TD}>{dsScore.toFixed(4)}</td>
                                                <td style={TD}>{brbScore.toFixed(4)}</td>
                                                <td style={{ ...TD, fontWeight: 700 }}>{item.score.toFixed(4)}</td>
                                                <td style={TD}><Badge cat={topCat(item.ds)} /></td>
                                                <td style={TD}><Badge cat={topCat(item.brb)} /></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Charts */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 16 }}>
                            <div style={{
                                background: "#fff", border: "1px solid #e2e8f0",
                                borderRadius: 12, padding: "1.25rem",
                            }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                    Radar — Multi-criteria Risk Profile
                                </div>
                                <RadarComparisonChart results={results} criteriaNames={criteriaNames} />
                            </div>
                            <div style={{
                                background: "#fff", border: "1px solid #e2e8f0",
                                borderRadius: 12, padding: "1.25rem",
                            }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                    VHR Dominance Score
                                </div>
                                <VHRDominanceChart results={results} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════ METHODOLOGY TAB ════════════════ */}
                {activeTab === "methodology" && (
                    <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 16, marginBottom: 20 }}>
                            {/* DS/ER explanation */}
                            <div style={{
                                background: "#fff", border: "1px solid #e2e8f0",
                                borderRadius: 12, padding: "1.25rem",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                    <Layers size={16} color="#E63946" />
                                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                                        DS/ER Algorithm
                                    </span>
                                </div>
                                {[
                                    ["Step 1", "Collect belief degrees for each sub-criterion across 5 risk grades (VHR→VLR). Ignorance Θ = 1 − Σβᵢ."],
                                    ["Step 2", "Compute conflict K = Σ m₁(A)·m₂(B) for all A≠B pairs of risk grades."],
                                    ["Step 3", "Compute unnormalized combined mass for each grade: m(A) = m₁(A)·m₂(A) + m₁(A)·m₂(Θ) + m₁(Θ)·m₂(A)"],
                                    ["Step 4", "Normalize: m(A) = m(A) / (1−K). This removes conflict and redistributes mass."],
                                    ["Step 5", "Recurse across all 20 sub-criteria iteratively. Final m(A) = overall belief for grade A."],
                                ].map(([t, d]) => (
                                    <div key={t} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                                        <div style={{
                                            minWidth: 52, height: 24, background: "#FFF1F2",
                                            border: "1px solid #FECACA", borderRadius: 6,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 11, fontWeight: 700, color: "#E63946",
                                        }}>{t}</div>
                                        <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{d}</div>
                                    </div>
                                ))}
                            </div>

                            {/* BRB explanation */}
                            <div style={{
                                background: "#fff", border: "1px solid #e2e8f0",
                                borderRadius: 12, padding: "1.25rem",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                    <Brain size={16} color="#457B9D" />
                                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                                        BRB Model
                                    </span>
                                </div>
                                {[
                                    ["Step 1", "Assign rule weights αₖ = wₖ / Σwₖ for each sub-criterion k. Equal weights used if not specified."],
                                    ["Step 2", "Compute weighted belief: w·β(A)ₖ = αₖ × β(A)ₖ and ignorance w·Θₖ = αₖ × Θₖ"],
                                    ["Step 3", "Compute BRB score for each grade: S(A) = Π(w·β(A)ₖ + w·Θₖ) − Π(w·Θₖ)"],
                                    ["Step 4", "Compute normalization factor μ = Σ S(A) + Π(w·Θₖ)"],
                                    ["Step 5", "Final belief β(A) = S(A)/μ for each risk grade. Ignorance = Π(w·Θₖ)/μ."],
                                ].map(([t, d]) => (
                                    <div key={t} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                                        <div style={{
                                            minWidth: 52, height: 24, background: "#EFF6FF",
                                            border: "1px solid #BFDBFE", borderRadius: 6,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 11, fontWeight: 700, color: "#457B9D",
                                        }}>{t}</div>
                                        <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{d}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hierarchy structure */}
                        <div style={{
                            background: "#fff", border: "1px solid #e2e8f0",
                            borderRadius: 12, padding: "1.25rem", marginBottom: 16,
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 14 }}>
                                Hierarchical Decision Structure
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {[
                                    { level: "Level 0 (Goal)", items: ["Ranking AI-Generated Misinformation Risk (Highest → Lowest)"] },
                                    { level: "Level 1 (Criteria)", items: criteriaNames },
                                    { level: "Level 2 (Sub-criteria)", items: ["4 sub-criteria per criterion × 5 criteria = 20 total"] },
                                    { level: "Level 3 (Alternatives)", items: alts },
                                ].map(row => (
                                    <div key={row.level} style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                                        <div style={{
                                            minWidth: 150, fontSize: 11, fontWeight: 600, color: "#64748b",
                                            paddingTop: 3,
                                        }}>{row.level}</div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                            {row.items.map(item => (
                                                <span key={item} style={{
                                                    background: "#f8fafc", border: "1px solid #e2e8f0",
                                                    borderRadius: 6, padding: "3px 10px",
                                                    fontSize: 12, color: "#1e293b",
                                                }}>{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Risk grade definitions */}
                        <div style={{
                            background: "#fff", border: "1px solid #e2e8f0",
                            borderRadius: 12, padding: "1.25rem",
                            overflowX: "auto"
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                                Risk Grade Definitions & Utility Values
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 500 }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc" }}>
                                        <th style={TH}>Grade</th>
                                        <th style={TH}>Full Name</th>
                                        <th style={TH}>Utility Weight</th>
                                        <th style={TH}>Interpretation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["VHR", "Very High Risk", 4, "Requires immediate intervention; extreme threat level"],
                                        ["HR", "High Risk", 3, "Significant concern; demands close monitoring"],
                                        ["MR", "Medium Risk", 2, "Moderate concern; standard precautions apply"],
                                        ["LR", "Low Risk", 1, "Minor concern; awareness sufficient"],
                                        ["VLR", "Very Low Risk", 0, "Negligible threat; routine operations continue"],
                                    ].map(([g, n, u, i]) => (
                                        <tr key={g} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={TD}><Badge cat={g} /></td>
                                            <td style={TD}>{n}</td>
                                            <td style={{ ...TD, fontWeight: 700, color: COLORS[g] }}>{u}</td>
                                            <td style={TD}>{i}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}