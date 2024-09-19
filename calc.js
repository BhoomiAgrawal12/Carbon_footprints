function showCalculator() {
    document.getElementById('calculator').style.display = 'block';
    document.querySelector('.intro').style.display = 'none';
}

function calculateCO2() {
    const electricity = document.getElementById('electricity').value;
    const petrol = document.getElementById('petrol').value;
    const lpg = document.getElementById('lpg').value;
    const waste = document.getElementById('waste').value;
    const meals = document.getElementById('meals').value;

    
    const electricityCO2 = (electricity * 12 * 0.8 / 1000).toFixed(2); // India: Approximately 0.7 to 0.9 kg CO2 per kWh
    const petrolCO2 = (petrol * 12 * 2.3 / 1000).toFixed(2); // Approximately 2.3 kg CO2 per litre
    const lpgCO2 = (lpg * 12 * 3.0 / 1000).toFixed(2); // Approximately 3.0 kg CO2 per kg
    const wasteCO2 = (waste * 52 * 0.75 / 1000).toFixed(2); // Approximately 0.5 to 1.0 kg CO2 per kg of waste
    const mealsCO2 = (meals * 365 * 2.0 / 1000).toFixed(2); // Average 2 kg CO2 per meal

    const totalCO2 = (parseFloat(electricityCO2) + parseFloat(petrolCO2) + parseFloat(lpgCO2) + parseFloat(wasteCO2) + parseFloat(mealsCO2)).toFixed(2);

    const averageIndianHouseholdCO2 = 1.6;
    const comparison = (totalCO2 - averageIndianHouseholdCO2).toFixed(2);
    const comparisonText = comparison > 0 
        ? `Your CO2 emissions are ${comparison} tonnes higher than the average Indian household.`
        : `Your CO2 emissions are ${Math.abs(comparison)} tonnes lower than the average Indian household.`;

    document.getElementById('electricityCO2').textContent = `💡 Electricity: ${electricityCO2} tonnes CO2 per year`;
    document.getElementById('petrolCO2').textContent = `🚗 Petrol/Diesel: ${petrolCO2} tonnes CO2 per year`;
    document.getElementById('lpgCO2').textContent = `🔥 LPG: ${lpgCO2} tonnes CO2 per year`;
    document.getElementById('wasteCO2').textContent = `🗑️ Waste: ${wasteCO2} tonnes CO2 per year`;
    document.getElementById('mealsCO2').textContent = `🍽️ Meals: ${mealsCO2} tonnes CO2 per year`;

    document.getElementById('totalFootprint').innerHTML = `🌍 Your Total Carbon Footprint is: ${totalCO2} tonnes CO2 per year`;
    document.getElementById('comparison').innerHTML = comparisonText;

    document.getElementById('results').style.display = 'block';
}