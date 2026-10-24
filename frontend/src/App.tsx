import React, { useState, useEffect } from 'react';

interface Product {
  product_id: string;
  name: string;
  model_number: string;
  first_component: string;
  component_material: string;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'assess'>('list');

  // New Product Form State
  const [productId, setProductId] = useState('');
  const [name, setName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [firstComponent, setFirstComponent] = useState('');
  const [componentMaterial, setComponentMaterial] = useState('');

  // Assessment Form State
  const [selectedProductForAssess, setSelectedProductForAssess] = useState('EM-001');
  const [airTemp, setAirTemp] = useState(298.1);
  const [processTemp, setProcessTemp] = useState(308.6);
  const [speed, setSpeed] = useState(1551);
  const [torque, setTorque] = useState(42.8);
  const [toolWear, setToolWear] = useState(0);
  const [recyclability, setRecyclability] = useState(85);
  const [reusability, setReusability] = useState(80);
  const [repairability, setRepairability] = useState(75);
  const [materialRecovery, setMaterialRecovery] = useState(90);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  const API_BASE = 'http://localhost:8000';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Backend not reachable");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !name) {
      alert("Please fill Product ID and Name");
      return;
    }

    const newProd: Product = {
      product_id: productId,
      name,
      model_number: modelNumber || 'N/A',
      first_component: firstComponent || 'N/A',
      component_material: componentMaterial || 'N/A'
    };

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (res.ok) {
        setProducts([...products, newProd]);
        setProductId('');
        setName('');
        setModelNumber('');
        setFirstComponent('');
        setComponentMaterial('');
      } else {
        const errData = await res.json();
        alert(errData.detail || "Error registering product");
      }
    } catch (err) {
      setProducts([...products, newProd]);
      setProductId('');
      setName('');
      setModelNumber('');
      setFirstComponent('');
      setComponentMaterial('');
    }
  };

  const handleAssessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/${selectedProductForAssess}/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          air_temp: airTemp,
          process_temp: processTemp,
          rotational_speed: speed,
          torque,
          tool_wear: toolWear,
          recyclability,
          reusability,
          repairability,
          material_recovery: materialRecovery
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAssessmentResult(data);
      } else {
        alert("Assessment failed");
      }
    } catch (err) {
      alert("Could not connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Top Navigation Bar */}
      <header className="navbar">
        <h1 onClick={() => setView('list')}>ProductPassport</h1>
        <div className="nav-links">
          <button 
            onClick={() => setView('list')} 
            className={view === 'list' ? 'active' : ''}
          >
            All products
          </button>
          <button 
            onClick={() => setView('assess')} 
            className={view === 'assess' ? 'active' : ''}
          >
            ML & Circularity Assessment
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="container">
        {view === 'list' ? (
          <>
            {/* Products Table */}
            <div className="card">
              <h2>Products</h2>
              <p className="subtitle">Registered motors and their digital passports.</p>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>MODEL</th>
                    <th style={{textAlign: 'right'}}>COMPONENTS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, idx) => (
                    <tr key={idx}>
                      <td style={{color: '#2563eb', fontWeight: 500}}>{p.product_id}</td>
                      <td>{p.name}</td>
                      <td>{p.model_number}</td>
                      <td style={{textAlign: 'right'}}>1</td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{textAlign: 'center', color: '#94a3b8', padding: '20px'}}>No products registered yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Register a new product Form */}
            <div className="card">
              <h2>Register a new product</h2>
              <form onSubmit={handleRegister}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Product ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. EM-002" 
                      value={productId}
                      onChange={e => setProductId(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Industrial Motor" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Model number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. M-77" 
                      value={modelNumber}
                      onChange={e => setModelNumber(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>First component</label>
                    <input 
                      type="text" 
                      placeholder="optional, e.g. Rotor" 
                      value={firstComponent}
                      onChange={e => setFirstComponent(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{maxWidth: '300px', marginBottom: '16px'}}>
                  <label>Component material</label>
                  <input 
                    type="text" 
                    placeholder="optional, e.g. Copper" 
                    value={componentMaterial}
                    onChange={e => setComponentMaterial(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Register product
                </button>
              </form>
            </div>
          </>
        ) : (
          /* ML Assessment View */
          <div className="card">
            <h2>ML Condition Assessment & Circularity</h2>
            <p className="subtitle">Run predictions and compute reuse/recycle recommendations.</p>

            <form onSubmit={handleAssessSubmit}>
              <div className="form-group" style={{maxWidth: '300px', marginBottom: '16px'}}>
                <label>Select Product</label>
                <select 
                  value={selectedProductForAssess} 
                  onChange={e => setSelectedProductForAssess(e.target.value)}
                >
                  {products.map((p, idx) => (
                    <option key={idx} value={p.product_id}>{p.product_id} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Air Temp (K)</label>
                  <input type="number" step="0.1" value={airTemp} onChange={e => setAirTemp(parseFloat(e.target.value))} />
                </div>
                <div className="form-group">
                  <label>Process Temp (K)</label>
                  <input type="number" step="0.1" value={processTemp} onChange={e => setProcessTemp(parseFloat(e.target.value))} />
                </div>
                <div className="form-group">
                  <label>Rotational Speed (rpm)</label>
                  <input type="number" value={speed} onChange={e => setSpeed(parseInt(e.target.value))} />
                </div>
                <div className="form-group">
                  <label>Torque (Nm)</label>
                  <input type="number" step="0.1" value={torque} onChange={e => setTorque(parseFloat(e.target.value))} />
                </div>
                <div className="form-group">
                  <label>Tool Wear (min)</label>
                  <input type="number" value={toolWear} onChange={e => setToolWear(parseInt(e.target.value))} />
                </div>
              </div>

              <div className="form-grid" style={{borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '16px'}}>
                <div className="form-group">
                  <label>Recyclability Score: {recyclability}</label>
                  <input type="range" min="0" max="100" value={recyclability} onChange={e => setRecyclability(parseInt(e.target.value))} style={{width: '100%'}} />
                </div>
                <div className="form-group">
                  <label>Reusability Score: {reusability}</label>
                  <input type="range" min="0" max="100" value={reusability} onChange={e => setReusability(parseInt(e.target.value))} style={{width: '100%'}} />
                </div>
                <div className="form-group">
                  <label>Repairability Score: {repairability}</label>
                  <input type="range" min="0" max="100" value={repairability} onChange={e => setRepairability(parseInt(e.target.value))} style={{width: '100%'}} />
                </div>
                <div className="form-group">
                  <label>Material Recovery Score: {materialRecovery}</label>
                  <input type="range" min="0" max="100" value={materialRecovery} onChange={e => setMaterialRecovery(parseInt(e.target.value))} style={{width: '100%'}} />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{marginTop: '16px'}}>
                {loading ? 'Running Assessment...' : 'Run ML Assessment'}
              </button>
            </form>

            {assessmentResult && (
              <div style={{marginTop: '24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px'}}>
                <h3 style={{fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px'}}>Assessment Results</h3>
                <div className="results-grid">
                  <div className="result-box">
                    <span>ML Prediction</span>
                    <p>{assessmentResult.ml_prediction}</p>
                    <span style={{color: '#2563eb', marginTop: '4px'}}>Confidence: {assessmentResult.ml_confidence}%</span>
                  </div>
                  <div className="result-box">
                    <span>Circularity Score</span>
                    <p style={{color: '#059669'}}>{assessmentResult.circularity_score} / 100</p>
                  </div>
                  <div className="result-box">
                    <span>Recommendation</span>
                    <p style={{color: '#047857', textTransform: 'uppercase'}}>{assessmentResult.recommendation}</p>
                  </div>
                </div>
                <div style={{marginTop: '16px', background: 'white', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0'}}>
                  <span style={{fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '2px'}}>Rationale</span>
                  <p style={{fontSize: '14px', color: '#334155', margin: 0}}>{assessmentResult.rationale}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
