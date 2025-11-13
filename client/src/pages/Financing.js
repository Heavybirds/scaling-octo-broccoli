import React, { useState } from 'react';
import api from '../services/api';

function Financing() {
  const [estimate, setEstimate] = useState(null);
  const [formData, setFormData] = useState({
    aircraftPrice: '',
    downPayment: '',
    interestRate: '',
    loanTerm: '',
    creditScore: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/financing/estimate', {
        aircraftPrice: parseFloat(formData.aircraftPrice),
        downPayment: parseFloat(formData.downPayment),
        interestRate: parseFloat(formData.interestRate),
        loanTerm: parseInt(formData.loanTerm),
        creditScore: formData.creditScore ? parseInt(formData.creditScore) : null
      });
      setEstimate(response.data.estimate);
    } catch (error) {
      console.error('Error calculating estimate:', error);
      alert('Failed to calculate financing estimate');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div>
      <h2>💰 Financing Estimator</h2>
      
      <div className="alert alert-info">
        <strong>💡 Smart Calculator:</strong> Get instant financing estimates for aircraft purchases
      </div>

      <div className="card">
        <h3>Calculate Financing</h3>
        <form onSubmit={handleCalculate}>
          <div className="form-group">
            <label>Aircraft Price *</label>
            <input
              type="number"
              name="aircraftPrice"
              value={formData.aircraftPrice}
              onChange={handleInputChange}
              placeholder="e.g., 5000000"
              required
            />
          </div>

          <div className="form-group">
            <label>Down Payment *</label>
            <input
              type="number"
              name="downPayment"
              value={formData.downPayment}
              onChange={handleInputChange}
              placeholder="e.g., 1000000"
              required
            />
          </div>

          <div className="form-group">
            <label>Interest Rate (%) *</label>
            <input
              type="number"
              step="0.01"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleInputChange}
              placeholder="e.g., 5.5"
              required
            />
          </div>

          <div className="form-group">
            <label>Loan Term (years) *</label>
            <input
              type="number"
              name="loanTerm"
              value={formData.loanTerm}
              onChange={handleInputChange}
              placeholder="e.g., 10"
              required
            />
          </div>

          <div className="form-group">
            <label>Credit Score (optional)</label>
            <input
              type="number"
              name="creditScore"
              value={formData.creditScore}
              onChange={handleInputChange}
              placeholder="e.g., 750"
            />
          </div>

          <button type="submit" className="btn btn-primary">Calculate</button>
        </form>
      </div>

      {estimate && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h3>Financing Estimate</h3>
          
          <div className="grid" style={{ marginTop: '20px' }}>
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Aircraft Price</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatCurrency(estimate.aircraftPrice)}
              </p>
            </div>

            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Down Payment</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatCurrency(estimate.downPayment)}
              </p>
              <p style={{ fontSize: '12px' }}>({estimate.downPaymentPercent}%)</p>
            </div>

            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Loan Amount</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatCurrency(estimate.loanAmount)}
              </p>
            </div>

            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Interest Rate</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {estimate.interestRate}%
              </p>
              {estimate.adjustedRate && (
                <p style={{ fontSize: '12px' }}>Adjusted: {estimate.adjustedRate.toFixed(2)}%</p>
              )}
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Monthly Payment:</span>
              <strong style={{ fontSize: '20px' }}>{formatCurrency(estimate.monthlyPayment)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Total Payment:</span>
              <strong>{formatCurrency(estimate.totalPayment)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Interest:</span>
              <strong>{formatCurrency(estimate.totalInterest)}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3>Financing Options</h3>
        <div className="grid">
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Traditional Bank Loan</h4>
            <p>Competitive rates for qualified buyers</p>
            <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
              <li>Lower interest rates</li>
              <li>Longer terms available</li>
              <li>Requires good credit</li>
            </ul>
          </div>

          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Aircraft Financing Specialists</h4>
            <p>Experts in aviation lending</p>
            <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
              <li>Industry expertise</li>
              <li>Flexible terms</li>
              <li>Fast approval</li>
            </ul>
          </div>

          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Lease Options</h4>
            <p>Flexible financing alternatives</p>
            <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
              <li>Lower upfront costs</li>
              <li>Tax advantages</li>
              <li>Operating flexibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Financing;
