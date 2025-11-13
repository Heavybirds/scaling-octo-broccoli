const express = require('express');
const router = express.Router();

// Calculate financing estimate for aircraft purchase
router.post('/estimate', (req, res) => {
  try {
    const { 
      aircraftPrice, 
      downPayment, 
      interestRate, 
      loanTerm, // in years
      creditScore 
    } = req.body;
    
    if (!aircraftPrice || !downPayment || !interestRate || !loanTerm) {
      return res.status(400).json({ 
        error: 'Aircraft price, down payment, interest rate, and loan term are required' 
      });
    }
    
    // Calculate loan amount
    const loanAmount = aircraftPrice - downPayment;
    
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    
    // Number of payments
    const numberOfPayments = loanTerm * 12;
    
    // Monthly payment calculation using standard loan formula
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // Total payment
    const totalPayment = monthlyPayment * numberOfPayments;
    
    // Total interest
    const totalInterest = totalPayment - loanAmount;
    
    // Credit score adjustment (simplified)
    let adjustedRate = interestRate;
    if (creditScore) {
      if (creditScore >= 750) adjustedRate *= 0.9;
      else if (creditScore < 650) adjustedRate *= 1.15;
    }
    
    const estimate = {
      aircraftPrice,
      downPayment: downPayment,
      downPaymentPercent: ((downPayment / aircraftPrice) * 100).toFixed(2),
      loanAmount,
      interestRate,
      adjustedRate: creditScore ? adjustedRate : null,
      loanTerm,
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      estimatedDate: new Date().toISOString()
    };
    
    res.json({
      message: 'Financing estimate calculated successfully',
      estimate
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate financing estimate' });
  }
});

// Compare financing options
router.post('/compare', (req, res) => {
  try {
    const { aircraftPrice, downPayment, options } = req.body;
    
    if (!options || !Array.isArray(options)) {
      return res.status(400).json({ error: 'Options array is required' });
    }
    
    const loanAmount = aircraftPrice - downPayment;
    
    const comparisons = options.map(option => {
      const monthlyRate = option.interestRate / 100 / 12;
      const numberOfPayments = option.loanTerm * 12;
      
      const monthlyPayment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      const totalPayment = monthlyPayment * numberOfPayments;
      
      return {
        lender: option.lender || 'Unknown',
        interestRate: option.interestRate,
        loanTerm: option.loanTerm,
        monthlyPayment: monthlyPayment.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        totalInterest: (totalPayment - loanAmount).toFixed(2)
      };
    });
    
    // Sort by monthly payment
    comparisons.sort((a, b) => parseFloat(a.monthlyPayment) - parseFloat(b.monthlyPayment));
    
    res.json({
      message: 'Financing options compared successfully',
      comparisons
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compare financing options' });
  }
});

module.exports = router;
