import {DecisionTree} from "./libraries/decisiontree.js"
// import {VegaTree} from "./libraries/vegatree.js"

//HTML
const display = document.getElementById("display");
const testbtn = document.querySelector("#test");

testbtn.addEventListener("click", () => loadSavedModel() && console.log("Loading saved model.."));

function loadSavedModel() {
    fetch("./model/model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}

function modelLoaded(model) {
    let decisionTree = new DecisionTree(model)

    let bmiValue= document.getElementById('bmi').value;
    let glucoseValue= document.getElementById('glucose').value;
    // console.log(`${bmiValue} + ${glucoseValue}`)

    // TEST DATA
    let data = { bmi: bmiValue, Glucose: glucoseValue }

    let prediction = decisionTree.predict(data)
    console.log("Predicted: " + data)

    if (prediction == 1) {
        display.innerText = `I predict that you have diabetes.`
    } else {
        display.innerText = `I predict that you don't have diabetes.`
    }

}