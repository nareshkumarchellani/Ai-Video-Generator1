const button = document.getElementById("generate");

button.addEventListener("click", async () => {

    const prompt = document.getElementById("prompt").value;
    const duration = Number(document.getElementById("duration").value);

    if(prompt.trim()===""){
        alert("Please enter a prompt.");
        return;
    }

    document.getElementById("status").innerText="Generating...";

    const response = await fetch("http://127.0.0.1:8000/generate",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            prompt,
            duration
        })

    });

    const data=await response.json();

    document.getElementById("status").innerText=
        "Job ID : "+data.job_id;

});