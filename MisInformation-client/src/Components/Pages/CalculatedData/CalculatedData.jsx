import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Eye, CheckCircle, XCircle, Calendar, Database } from 'lucide-react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

const CalculatedData = () => {
    const axiosSecure = UseAxiosSecure();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosSecure.get('/inputSurvey');
            let json = response.data;
            
            // Process data - handle both array and object responses
            let dataArray = [];
            if (Array.isArray(json)) {
                dataArray = json;
            } else if (json && typeof json === 'object') {
                dataArray = [json];
            }
            
            // Filter only calculated data
            const calculatedData = dataArray.filter(item => 
                item.isCalculated === true || item.isCalculated === "true"
            );
            
            setData(calculatedData);
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
                Loading calculated data...
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

    if (data.length === 0) {
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 300, gap: 12, color: "#64748b", fontFamily: "sans-serif",
                flexDirection: "column"
            }}>
                <Database size={48} strokeWidth={1.5} />
                <div style={{ fontSize: 14 }}>No calculated data found.</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                    Please input data and run the algorithm first.
                </div>
                <Link to='/InputData'>
                    <button style={{
                        marginTop: 12,
                        padding: "8px 16px",
                        background: "#E63946",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer"
                    }}>
                        Go to Input Data
                    </button>
                </Link>
            </div>
        );
    }

    // Calculate risk scores for each data entry
    const RISK_WEIGHT = { VHR: 4, HR: 3, MR: 2, LR: 1, VLR: 0 };
    
    const getTopRisk = (results) => {
        if (!results) return "N/A";
        let maxCat = "VLR";
        let maxVal = 0;
        for (const [key, value] of Object.entries(results)) {
            if (value > maxVal && key !== "Theta" && key !== "_id") {
                maxVal = value;
                maxCat = key;
            }
        }
        return maxCat;
    };

    const getCombinedScore = (results) => {
        if (!results) return 0;
        let score = 0;
        for (const [key, value] of Object.entries(results)) {
            if (RISK_WEIGHT[key] !== undefined) {
                score += RISK_WEIGHT[key] * value;
            }
        }
        return score.toFixed(4);
    };

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

    return (
        <div style={{
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            background: "#f8fafc", minHeight: "100vh", padding: "2rem"
        }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                        Calculated Risk Data
                    </h1>
                    <p style={{ fontSize: 14, color: "#64748b" }}>
                        List of all AI-generated misinformation risk analysis calculations
                    </p>
                </div>

                {/* Table */}
                <div style={{
                    background: "#fff", border: "1px solid #e2e8f0",
                    borderRadius: 12, overflow: "hidden"
                }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                    <th style={TH}>#</th>
                                    <th style={TH}>Title</th>
                                    <th style={TH}>Alternatives</th>
                                    <th style={TH}>Calculated At</th>
                                    <th style={TH}>Top Risk (Deepfake)</th>
                                    <th style={TH}>Top Risk (Fake News)</th>
                                    <th style={TH}>Top Risk (Voice Scam)</th>
                                    <th style={TH}>Top Risk (Phishing)</th>
                                    <th style={TH}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => {
                                    const results = item.calculatedResults;
                                    return (
                                        <tr key={item._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={TD}>{index + 1}</td>
                                            <td style={{ ...TD, fontWeight: 600 }}>
                                                {item.metadata?.title || "Risk Analysis"}
                                            </td>
                                            <td style={TD}>
                                                {item.metadata?.alternatives?.length || 4}
                                            </td>
                                            <td style={TD}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Calendar size={12} color="#94a3b8" />
                                                    <span style={{ fontSize: 12 }}>
                                                        {formatDate(item.calculatedAt)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={TD}>
                                                {results?.Deepfake && <Badge cat={getTopRisk(results.Deepfake.ds)} />}
                                            </td>
                                            <td style={TD}>
                                                {results?.["Fake News"] && <Badge cat={getTopRisk(results["Fake News"].ds)} />}
                                            </td>
                                            <td style={TD}>
                                                {results?.["Voice Scam"] && <Badge cat={getTopRisk(results["Voice Scam"].ds)} />}
                                            </td>
                                            <td style={TD}>
                                                {results?.Phishing && <Badge cat={getTopRisk(results.Phishing.ds)} />}
                                            </td>
                                            <td style={TD}>
                                                <Link to={`/DataDetails/${item._id}`} state={{ data: item }}>
                                                    <button style={{
                                                        display: "flex", alignItems: "center", gap: 4,
                                                        padding: "4px 10px", background: "#E63946",
                                                        color: "white", border: "none", borderRadius: 6,
                                                        cursor: "pointer", fontSize: 11, fontWeight: 500
                                                    }}>
                                                        <Eye size={12} />
                                                        View Details
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Cards */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 20
                }}>
                    <div style={{
                        background: "#fff", border: "1px solid #e2e8f0",
                        borderRadius: 12, padding: "1rem"
                    }}>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Total Calculations</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>{data.length}</div>
                    </div>
                    <div style={{
                        background: "#fff", border: "1px solid #e2e8f0",
                        borderRadius: 12, padding: "1rem"
                    }}>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Alternatives</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>4</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Deepfake · Fake News · Voice Scam · Phishing</div>
                    </div>
                    <div style={{
                        background: "#fff", border: "1px solid #e2e8f0",
                        borderRadius: 12, padding: "1rem"
                    }}>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Risk Grades</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>5</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>VHR · HR · MR · LR · VLR</div>
                    </div>
                    <div style={{
                        background: "#fff", border: "1px solid #e2e8f0",
                        borderRadius: 12, padding: "1rem"
                    }}>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Status</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                            <CheckCircle size={16} color="#16a34a" />
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#16a34a" }}>Calculated</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TH = {
    padding: "12px 16px", textAlign: "left", fontWeight: 600,
    color: "#64748b", fontSize: 12,
};
const TD = {
    padding: "12px 16px", color: "#1e293b", fontSize: 13,
};

export default CalculatedData;