import {DecisionTree} from "./libraries/decisiontree.js"
import {VegaTree} from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "data/diabetes.csv"
const trainingLabel = "Label"
const ignored = ["Label", "Pregnant", "Age", "Pedigree", "Bp", "Insulin", "Skin"]

//HTML stuff
const display = document.getElementById("display");
const trueTrue = document.getElementById("1");
const falseTrue = document.getElementById("2");
const trueFalse = document.getElementById("3");
const falseFalse = document.getElementById("4");


//
// LOAD CSV
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data) // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    data.sort(() => (Math.random() - 0.5));
    let trainData = data.slice(0, Math.floor(data.length * 0.8));
    let testData = data.slice(Math.floor(data.length * 0.8) + 1);


    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel,
        maxTreeDepth: 4
    })

    // Draw Tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())

    let amountCorrect = 0;

    let predictedDiabetesWasDiabetes = 0;
    let predictedDiabetesWasHealthy = 0;
    let predictedHealthyWasHealthy = 0;
    let predictedHealthyWasDiabetes = 0;
    for (let row of testData) {
        let prediction = decisionTree.predict(row)
        if (prediction == row.Label) {
            amountCorrect++
        }
        if (prediction == 1 && row.Label == 1) {
            predictedDiabetesWasDiabetes++
        }
        if (prediction == 1 && row.Label == 0) {
            predictedDiabetesWasHealthy++
        }
        if (prediction == 0 && row.Label == 0) {
            predictedHealthyWasHealthy++
        }
        if (prediction == 0 && row.Label == 1) {
            predictedHealthyWasDiabetes++
        }
    }

    //Calculate accuracy
    let accuracy = amountCorrect / testData.length
    console.log(accuracy)
    display.innerText = `Accuracy: ${accuracy}`;

    //Confusion Matrix
    trueTrue.innerText = `${predictedDiabetesWasDiabetes}`;
    trueFalse.innerText = `${predictedDiabetesWasHealthy}`;
    falseTrue.innerText = `${predictedHealthyWasHealthy}`;
    falseFalse.innerText = `${predictedHealthyWasDiabetes}`;

    //SAVE model
    let json = decisionTree.stringify()
    console.log(`JSON: ${json}`)
}


loadData()