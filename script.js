function calculateNetto() {
    let brutto = parseFloat(document.getElementById('brutto').value) || 0;
    let taxClass = parseInt(document.getElementById('steuerklasse').value);
    let kvZusatz = parseFloat(document.getElementById('kvZusatz').value) || 0;
    let bundesland = document.getElementById('bundesland').value;
    let isChurchMember = document.getElementById('kirche').checked;

    // Социални осигуровки за Германия (проценти за сметка на служителя)
    let renten = brutto * 0.093; // 9.3%
    let arbeitslosen = brutto * 0.013; // 1.3%
    let kranken = brutto * (0.073 + (kvZusatz / 2 / 100)); // 7.3% + половината от Zusatzbeitrag
    
    // Pflegeversicherung (в Саксония е малко по-различно, тук взимаме стандартна за пример)
    let pflegeRate = (bundesland === 'sachsen') ? 0.022 : 0.022; 
    let pflege = brutto * pflegeRate;

    let totalSocial = renten + arbeitslosen + kranken + pflege;

    // Данъци (симулация спрямо класовете)
    let estimatedTax = 0;
    if (taxClass === 1 || taxClass === 4) {
        estimatedTax = brutto > 2500 ? (brutto - 2500) * 0.28 + 200 : brutto * 0.12;
    } else if (taxClass === 3) {
        estimatedTax = brutto > 3500 ? (brutto - 3500) * 0.20 + 120 : brutto * 0.06;
    } else if (taxClass === 5 || taxClass === 6) {
        estimatedTax = brutto * 0.25;
    } else {
        estimatedTax = brutto * 0.15;
    }
    if (estimatedTax < 0) estimatedTax = 0;

    // Църковен данък (обикновено 8% или 9% от Lohnsteuer в зависимост от провинцията)
    let churchTax = 0;
    if (isChurchMember) {
        let churchRate = (bundesland === 'bayern') ? 0.08 : 0.09;
        churchTax = estimatedTax * churchRate;
    }

    let netto = brutto - totalSocial - estimatedTax - churchTax;

    // Визуализиране на резултатите
    document.getElementById('nettoResult').innerText = netto > 0 ? netto.toFixed(2) + ' €' : '0.00 €';
    document.getElementById('taxResult').innerText = estimatedTax.toFixed(2) + ' €';
    document.getElementById('churchResult').innerText = churchTax.toFixed(2) + ' €';
    document.getElementById('socialResult').innerText = totalSocial.toFixed(2) + ' €';
}

// Закачане на събития към всички полета, за да се пресмята веднага при промяна
document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', calculateNetto);
    element.addEventListener('change', calculateNetto);
});

// Първоначално изчисление при зареждане
calculateNetto();