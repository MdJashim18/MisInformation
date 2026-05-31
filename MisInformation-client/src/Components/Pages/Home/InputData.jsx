import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { Link } from 'react-router';

const InputData = () => {
    const axiosSecure = UseAxiosSecure();
    
    // Predefined structure with dummy belief data
    const initialCriteriaData = [
      {
        id: "C1",
        name: "Technical Feasibility of Creation",
        weight: 0.20,
        subCriteria: [
          { 
            id: "C1S1", 
            name: "Required AI skills/tools", 
            weight: 0.35,
            beliefs: {
              "Deepfake": { "VHR": 0.412, "HR": 0.294, "MR": 0.235, "LR": 0.059, "VLR": 0.000 },
              "Fake News": { "VHR": 0.324, "HR": 0.235, "MR": 0.294, "LR": 0.088, "VLR": 0.059 },
              "Voice Scam": { "VHR": 0.242, "HR": 0.182, "MR": 0.394, "LR": 0.182, "VLR": 0.000 },
              "Phishing": { "VHR": 0.273, "HR": 0.212, "MR": 0.242, "LR": 0.212, "VLR": 0.061 }
            }
          },
          { 
            id: "C1S2", 
            name: "Time required to generate", 
            weight: 0.20,
            beliefs: {
              "Deepfake": { "VHR": 0.303, "HR": 0.212, "MR": 0.333, "LR": 0.091, "VLR": 0.061 },
              "Fake News": { "VHR": 0.273, "HR": 0.273, "MR": 0.303, "LR": 0.121, "VLR": 0.030 },
              "Voice Scam": { "VHR": 0.250, "HR": 0.219, "MR": 0.438, "LR": 0.093, "VLR": 0.000 },
              "Phishing": { "VHR": 0.303, "HR": 0.182, "MR": 0.333, "LR": 0.182, "VLR": 0.000 }
            }
          },
          { 
            id: "C1S3", 
            name: "Cost involved", 
            weight: 0.20,
            beliefs: {
              "Deepfake": { "VHR": 0.455, "HR": 0.212, "MR": 0.212, "LR": 0.091, "VLR": 0.030 },
              "Fake News": { "VHR": 0.273, "HR": 0.182, "MR": 0.394, "LR": 0.121, "VLR": 0.030 },
              "Voice Scam": { "VHR": 0.271, "HR": 0.212, "MR": 0.364, "LR": 0.091, "VLR": 0.061 },
              "Phishing": { "VHR": 0.273, "HR": 0.242, "MR": 0.212, "LR": 0.182, "VLR": 0.091 }
            }
          },
          { 
            id: "C1S4", 
            name: "Scalability (mass production ease)", 
            weight: 0.25,
            beliefs: {
              "Deepfake": { "VHR": 0.303, "HR": 0.303, "MR": 0.273, "LR": 0.091, "VLR": 0.030 },
              "Fake News": { "VHR": 0.242, "HR": 0.212, "MR": 0.242, "LR": 0.242, "VLR": 0.062 },
              "Voice Scam": { "VHR": 0.250, "HR": 0.219, "MR": 0.438, "LR": 0.063, "VLR": 0.030 },
              "Phishing": { "VHR": 0.242, "HR": 0.273, "MR": 0.364, "LR": 0.091, "VLR": 0.030 }
            }
          }
        ]
      },
      {
        id: "C2",
        name: "Detection Difficulty",
        weight: 0.25,
        subCriteria: [
          { 
            id: "C2S1", 
            name: "Current detection tool accuracy", 
            weight: 0.30,
            beliefs: {
              "Deepfake": { "VHR": 0.273, "HR": 0.303, "MR": 0.364, "LR": 0.060, "VLR": 0.000 },
              "Fake News": { "VHR": 0.212, "HR": 0.333, "MR": 0.303, "LR": 0.152, "VLR": 0.000 },
              "Voice Scam": { "VHR": 0.303, "HR": 0.213, "MR": 0.333, "LR": 0.121, "VLR": 0.030 },
              "Phishing": { "VHR": 0.303, "HR": 0.121, "MR": 0.364, "LR": 0.182, "VLR": 0.030 }
            }
          },
          { 
            id: "C2S2", 
            name: "Forensic analysis difficulty", 
            weight: 0.25,
            beliefs: {
              "Deepfake": { "VHR": 0.364, "HR": 0.273, "MR": 0.152, "LR": 0.181, "VLR": 0.030 },
              "Fake News": { "VHR": 0.242, "HR": 0.424, "MR": 0.212, "LR": 0.061, "VLR": 0.061 },
              "Voice Scam": { "VHR": 0.242, "HR": 0.212, "MR": 0.455, "LR": 0.091, "VLR": 0.000 },
              "Phishing": { "VHR": 0.212, "HR": 0.121, "MR": 0.364, "LR": 0.242, "VLR": 0.061 }
            }
          },
          { 
            id: "C2S3", 
            name: "Human perception accuracy", 
            weight: 0.25,
            beliefs: {
              "Deepfake": { "VHR": 0.294, "HR": 0.265, "MR": 0.324, "LR": 0.059, "VLR": 0.058 },
              "Fake News": { "VHR": 0.265, "HR": 0.324, "MR": 0.265, "LR": 0.088, "VLR": 0.058 },
              "Voice Scam": { "VHR": 0.242, "HR": 0.152, "MR": 0.455, "LR": 0.121, "VLR": 0.030 },
              "Phishing": { "VHR": 0.242, "HR": 0.212, "MR": 0.364, "LR": 0.152, "VLR": 0.030 }
            }
          },
          { 
            id: "C2S4", 
            name: "Platform-level auto detection rate", 
            weight: 0.20,
            beliefs: {
              "Deepfake": { "VHR": 0.313, "HR": 0.281, "MR": 0.250, "LR": 0.125, "VLR": 0.031 },
              "Fake News": { "VHR": 0.181, "HR": 0.273, "MR": 0.303, "LR": 0.091, "VLR": 0.152 },
              "Voice Scam": { "VHR": 0.194, "HR": 0.194, "MR": 0.451, "LR": 0.161, "VLR": 0.000 },
              "Phishing": { "VHR": 0.303, "HR": 0.242, "MR": 0.303, "LR": 0.152, "VLR": 0.000 }
            }
          }
        ]
      },
      {
        id: "C3",
        name: "Dissemination & Spread Potential",
        weight: 0.20,
        subCriteria: [
          { 
            id: "C3S1", 
            name: "Virality on social media", 
            weight: 0.35,
            beliefs: {
              "Deepfake": { "VHR": 0.364, "HR": 0.212, "MR": 0.394, "LR": 0.030, "VLR": 0.000 },
              "Fake News": { "VHR": 0.182, "HR": 0.303, "MR": 0.394, "LR": 0.121, "VLR": 0.000 },
              "Voice Scam": { "VHR": 0.219, "HR": 0.219, "MR": 0.406, "LR": 0.094, "VLR": 0.062 },
              "Phishing": { "VHR": 0.212, "HR": 0.212, "MR": 0.364, "LR": 0.152, "VLR": 0.060 }
            }
          },
          { 
            id: "C3S2", 
            name: "Ease of sharing", 
            weight: 0.20,
            beliefs: {
              "Deepfake": { "VHR": 0.250, "HR": 0.281, "MR": 0.313, "LR": 0.166, "VLR": 0.000 },
              "Fake News": { "VHR": 0.250, "HR": 0.281, "MR": 0.344, "LR": 0.063, "VLR": 0.063 },
              "Voice Scam": { "VHR": 0.250, "HR": 0.281, "MR": 0.406, "LR": 0.063, "VLR": 0.000 },
              "Phishing": { "VHR": 0.219, "HR": 0.156, "MR": 0.344, "LR": 0.250, "VLR": 0.031 }
            }
          },
          { 
            id: "C3S3", 
            name: "Potential audience reach", 
            weight: 0.25,
            beliefs: {
              "Deepfake": { "VHR": 0.281, "HR": 0.313, "MR": 0.344, "LR": 0.062, "VLR": 0.000 },
              "Fake News": { "VHR": 0.323, "HR": 0.323, "MR": 0.290, "LR": 0.032, "VLR": 0.032 },
              "Voice Scam": { "VHR": 0.250, "HR": 0.375, "MR": 0.281, "LR": 0.094, "VLR": 0.000 },
              "Phishing": { "VHR": 0.281, "HR": 0.219, "MR": 0.344, "LR": 0.156, "VLR": 0.000 }
            }
          },
          { 
            id: "C3S4", 
            name: "Platform vulnerability", 
            weight: 0.20,
            beliefs: {
              "Deepfake": { "VHR": 0.281, "HR": 0.281, "MR": 0.313, "LR": 0.125, "VLR": 0.000 },
              "Fake News": { "VHR": 0.219, "HR": 0.375, "MR": 0.219, "LR": 0.125, "VLR": 0.062 },
              "Voice Scam": { "VHR": 0.250, "HR": 0.281, "MR": 0.313, "LR": 0.125, "VLR": 0.031 },
              "Phishing": { "VHR": 0.218, "HR": 0.250, "MR": 0.313, "LR": 0.219, "VLR": 0.000 }
            }
          }
        ]
      },
      {
        id: "C4",
        name: "Severity of Potential Impact",
        weight: 0.20,
        subCriteria: [
          { 
            id: "C4S1", 
            name: "Financial/Economic loss potential", 
            weight: 0.25,
            beliefs: {
              "Deepfake": { "VHR": 0.367, "HR": 0.200, "MR": 0.400, "LR": 0.033, "VLR": 0.000 },
              "Fake News": { "VHR": 0.233, "HR": 0.467, "MR": 0.233, "LR": 0.067, "VLR": 0.000 },
              "Voice Scam": { "VHR": 0.241, "HR": 0.276, "MR": 0.313, "LR": 0.414, "VLR": 0.069 },
              "Phishing": { "VHR": 0.300, "HR": 0.200, "MR": 0.300, "LR": 0.200, "VLR": 0.000 }
            }
          },
          { 
            id: "C4S2", 
            name: "Social/Psychological harm", 
            weight: 0.30,
            beliefs: {
              "Deepfake": { "VHR": 0.333, "HR": 0.267, "MR": 0.267, "LR": 0.067, "VLR": 0.066 },
              "Fake News": { "VHR": 0.233, "HR": 0.367, "MR": 0.333, "LR": 0.067, "VLR": 0.000 },
              "Voice Scam": { "VHR": 0.200, "HR": 0.300, "MR": 0.300, "LR": 0.200, "VLR": 0.000 },
              "Phishing": { "VHR": 0.267, "HR": 0.133, "MR": 0.433, "LR": 0.100, "VLR": 0.067 }
            }
          },
          { 
            id: "C4S3", 
            name: "Political/Societal division", 
            weight: 0.25,
            beliefs: {
              "Deepfake": { "VHR": 0.400, "HR": 0.200, "MR": 0.300, "LR": 0.067, "VLR": 0.033 },
              "Fake News": { "VHR": 0.233, "HR": 0.333, "MR": 0.300, "LR": 0.100, "VLR": 0.034 },
              "Voice Scam": { "VHR": 0.233, "HR": 0.267, "MR": 0.400, "LR": 0.100, "VLR": 0.000 },
              "Phishing": { "VHR": 0.267, "HR": 0.233, "MR": 0.400, "LR": 0.100, "VLR": 0.000 }
            }
          },
          { 
            id: "C4S4", 
            name: "Long-term reputation damage", 
            weight: 0.20,
            beliefs: {
              "Deepfake": { "VHR": 0.400, "HR": 0.100, "MR": 0.367, "LR": 0.133, "VLR": 0.000 },
              "Fake News": { "VHR": 0.300, "HR": 0.200, "MR": 0.367, "LR": 0.133, "VLR": 0.000 },
              "Voice Scam": { "VHR": 0.233, "HR": 0.233, "MR": 0.400, "LR": 0.134, "VLR": 0.000 },
              "Phishing": { "VHR": 0.233, "HR": 0.300, "MR": 0.300, "LR": 0.133, "VLR": 0.034 }
            }
          }
        ]
      },
      {
        id: "C5",
        name: "Victim Susceptibility",
        weight: 0.15,
        subCriteria: [
          { 
            id: "C5S1", 
            name: "Emotional manipulation power", 
            weight: 0.30,
            beliefs: {
              "Deepfake": { "VHR": 0.367, "HR": 0.267, "MR": 0.266, "LR": 0.100, "VLR": 0.000 },
              "Fake News": { "VHR": 0.310, "HR": 0.345, "MR": 0.207, "LR": 0.137, "VLR": 0.000 },
              "Voice Scam": { "VHR": 0.276, "HR": 0.138, "MR": 0.517, "LR": 0.034, "VLR": 0.035 },
              "Phishing": { "VHR": 0.267, "HR": 0.167, "MR": 0.367, "LR": 0.133, "VLR": 0.066 }
            }
          },
          { 
            id: "C5S2", 
            name: "Trust exploitation level", 
            weight: 0.30,
            beliefs: {
              "Deepfake": { "VHR": 0.400, "HR": 0.200, "MR": 0.200, "LR": 0.167, "VLR": 0.033 },
              "Fake News": { "VHR": 0.333, "HR": 0.233, "MR": 0.267, "LR": 0.067, "VLR": 0.100 },
              "Voice Scam": { "VHR": 0.267, "HR": 0.267, "MR": 0.400, "LR": 0.033, "VLR": 0.033 },
              "Phishing": { "VHR": 0.233, "HR": 0.233, "MR": 0.400, "LR": 0.100, "VLR": 0.034 }
            }
          },
          { 
            id: "C5S3", 
            name: "Target group size", 
            weight: 0.20,
            beliefs: {
              "Deepfake": { "VHR": 0.400, "HR": 0.233, "MR": 0.267, "LR": 0.100, "VLR": 0.000 },
              "Fake News": { "VHR": 0.267, "HR": 0.333, "MR": 0.267, "LR": 0.100, "VLR": 0.033 },
              "Voice Scam": { "VHR": 0.233, "HR": 0.300, "MR": 0.400, "LR": 0.067, "VLR": 0.000 },
              "Phishing": { "VHR": 0.322, "HR": 0.194, "MR": 0.355, "LR": 0.129, "VLR": 0.000 }
            }
          },
          { 
            id: "C5S4", 
            name: "Urgency/pressure factor", 
            weight: 0.20,
            beliefs: {
              "Deepfake": { "VHR": 0.290, "HR": 0.355, "MR": 0.226, "LR": 0.097, "VLR": 0.032 },
              "Fake News": { "VHR": 0.300, "HR": 0.233, "MR": 0.267, "LR": 0.200, "VLR": 0.000 },
              "Voice Scam": { "VHR": 0.267, "HR": 0.133, "MR": 0.467, "LR": 0.067, "VLR": 0.066 },
              "Phishing": { "VHR": 0.300, "HR": 0.100, "MR": 0.433, "LR": 0.133, "VLR": 0.034 }
            }
          }
        ]
      }
    ];

    const alternatives = ["Deepfake", "Fake News", "Voice Scam", "Phishing"];
    const riskGrades = ["VHR", "HR", "MR", "LR", "VLR"];
    
    // State for criteria data with editable weights
    const [criteriaData, setCriteriaData] = useState(initialCriteriaData);
    const [formData, setFormData] = useState({});

    // Initialize form data from initialCriteriaData
    useEffect(() => {
      const initialFormData = {};
      initialCriteriaData.forEach(criterion => {
        criterion.subCriteria.forEach(sub => {
          alternatives.forEach(alt => {
            riskGrades.forEach(grade => {
              const fieldName = `${criterion.id}_${sub.id}_${alt}_${grade}`;
              initialFormData[fieldName] = sub.beliefs[alt][grade];
            });
          });
        });
      });
      setFormData(initialFormData);
    }, []);

    const handleInputChange = (fieldName, value) => {
      setFormData(prev => ({
        ...prev,
        [fieldName]: parseFloat(value) || 0
      }));
    };

    const handleCriterionWeightChange = (criterionId, newWeight) => {
      setCriteriaData(prev => prev.map(criterion => 
        criterion.id === criterionId 
          ? { ...criterion, weight: parseFloat(newWeight) || 0 }
          : criterion
      ));
    };

    const handleSubCriterionWeightChange = (criterionId, subId, newWeight) => {
      setCriteriaData(prev => prev.map(criterion => {
        if (criterion.id === criterionId) {
          return {
            ...criterion,
            subCriteria: criterion.subCriteria.map(sub => 
              sub.id === subId 
                ? { ...sub, weight: parseFloat(newWeight) || 0 }
                : sub
            )
          };
        }
        return criterion;
      }));
    };

    // Helper to get sum for a specific sub-criteria and alternative
    const getSumForSubAndAlt = (criterionId, subId, alt) => {
      let sum = 0;
      riskGrades.forEach(grade => {
        const fieldName = `${criterionId}_${subId}_${alt}_${grade}`;
        const value = formData[fieldName] || 0;
        sum += parseFloat(value) || 0;
      });
      return sum.toFixed(3);
    };

    // Check if sum is valid (equals 1 within tolerance)
    const isSumValid = (criterionId, subId, alt) => {
      const sum = parseFloat(getSumForSubAndAlt(criterionId, subId, alt));
      return Math.abs(sum - 1) < 0.001;
    };

    // Validate all criteria weights sum to 1
    const validateCriteriaWeights = () => {
      const total = criteriaData.reduce((sum, c) => sum + c.weight, 0);
      return Math.abs(total - 1) < 0.001;
    };

    // Validate each criterion's sub-weights sum to 1
    const validateSubWeights = (criterion) => {
      const total = criterion.subCriteria.reduce((sum, sub) => sum + sub.weight, 0);
      return Math.abs(total - 1) < 0.001;
    };

    const onSubmit = async () => {
      // Transform data into the required JSON structure
      const transformedData = {
        metadata: {
          title: "AI-Generated Misinformation Risk Analysis",
          description: "Belief degree data for DS/ER + BRB combined algorithm",
          alternatives: alternatives,
          riskGrades: riskGrades,
          isCalculated: "false",
          criteria: criteriaData.map(criterion => ({
            id: criterion.id,
            name: criterion.name,
            weight: criterion.weight,
            subCriteria: criterion.subCriteria.map(sub => ({
              id: sub.id,
              name: sub.name,
              weight: sub.weight,
              beliefs: alternatives.reduce((acc, alt) => {
                const beliefs = {};
                riskGrades.forEach(grade => {
                  const fieldName = `${criterion.id}_${sub.id}_${alt}_${grade}`;
                  beliefs[grade] = formData[fieldName] || 0;
                });
                acc[alt] = beliefs;
                return acc;
              }, {})
            }))
          }))
        }
      };
      
      console.log("Submitted Data:", JSON.stringify(transformedData, null, 2));
      
      // Send to API
      try {
        const response = await axiosSecure.post('/inputSurvey', transformedData);
        console.log("API Response:", response.data);
        // console.log("Input Data",transformedData)
        alert("Data submitted successfully!");
      } catch (error) {
        console.error("Error submitting data:", error);
        alert("Error submitting data. Please try again.");
      }
    };

    const criteriaWeightsValid = validateCriteriaWeights();

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">AI-Generated Misinformation Risk Analysis</h1>
        <p className="text-gray-600 mb-6">Belief degree data for DS/ER + BRB combined algorithm</p>
        
        {/* Criteria Weights Section */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Criteria Weights (Sum must = 1)</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {criteriaData.map((criterion) => (
              <div key={criterion.id} className="flex items-center gap-2">
                <label className="font-medium min-w-[40px]">{criterion.id}:</label>
                <input
                  type="number"
                  step="0.001"
                  value={criterion.weight}
                  onChange={(e) => handleCriterionWeightChange(criterion.id, e.target.value)}
                  className="w-24 p-1 border rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">{criterion.name}</span>
              </div>
            ))}
          </div>
          <div className={`mt-2 text-sm font-semibold ${criteriaWeightsValid ? 'text-green-600' : 'text-red-600'}`}>
            Total Criteria Weight: {criteriaData.reduce((sum, c) => sum + c.weight, 0).toFixed(3)} 
            {!criteriaWeightsValid && " (Must equal 1.000)"}
          </div>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-8">
          {criteriaData.map((criterion) => {
            const subWeightsValid = validateSubWeights(criterion);
            return (
              <div key={criterion.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">
                    {criterion.id}: {criterion.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Weight:</span>
                    <input
                      type="number"
                      step="0.001"
                      value={criterion.weight}
                      onChange={(e) => handleCriterionWeightChange(criterion.id, e.target.value)}
                      className="w-20 p-1 border rounded border-gray-300"
                    />
                  </div>
                </div>
                
                {/* Sub-criteria weights summary */}
                <div className={`mb-3 text-sm ${subWeightsValid ? 'text-green-600' : 'text-red-600'}`}>
                  Sub-criteria total weight: {criterion.subCriteria.reduce((sum, sub) => sum + sub.weight, 0).toFixed(3)}
                  {!subWeightsValid && " (Must equal 1.000)"}
                </div>
                
                {criterion.subCriteria.map((sub) => (
                  <div key={sub.id} className="ml-4 mb-6 border-l-2 border-gray-300 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">
                        {sub.id}: {sub.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Weight:</span>
                        <input
                          type="number"
                          step="0.001"
                          value={sub.weight}
                          onChange={(e) => handleSubCriterionWeightChange(criterion.id, sub.id, e.target.value)}
                          className="w-20 p-1 border rounded border-gray-300"
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border text-sm">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border p-2">Alternative</th>
                            {riskGrades.map(grade => (
                              <th key={grade} className="border p-2">{grade}</th>
                            ))}
                            <th className="border p-2 bg-gray-100">Sum (must = 1)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alternatives.map((alt) => {
                            const sum = getSumForSubAndAlt(criterion.id, sub.id, alt);
                            const valid = isSumValid(criterion.id, sub.id, alt);
                            return (
                              <tr key={alt} className={!valid ? 'bg-red-50' : ''}>
                                <td className="border p-2 font-medium">{alt}</td>
                                {riskGrades.map((grade) => {
                                  const fieldName = `${criterion.id}_${sub.id}_${alt}_${grade}`;
                                  return (
                                    <td key={grade} className="border p-2">
                                      <input
                                        type="number"
                                        step="0.001"
                                        className="w-24 p-1 border rounded border-gray-300 focus:border-blue-500 focus:outline-none"
                                        value={formData[fieldName] || 0}
                                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                                        placeholder="0.000"
                                      />
                                    </td>
                                  );
                                })}
                                <td className={`border p-2 text-center font-bold ${valid ? 'text-green-600' : 'text-red-600'}`}>
                                  {sum}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      * Each row must sum to 1.000. Current sums are shown in the last column.
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="btn rounded-full bg-gradient-to-r from-[#632EE3] to-[#9F62F2] text-white font-semibold px-6 shadow-lg transition-all duration-300"
            >
              Submit Survey Data
            </button>
          </div>
        </form>
        <div className="flex justify-center mt-6">
            <Link to='/ApplyAlgorithm' className="btn rounded-full bg-gradient-to-r from-[#632EE3] to-[#9F62F2] text-white font-semibold px-6 shadow-lg transition-all duration-300" >Apply Algorithm</Link>
        </div>
      </div>
    );
};

export default InputData;