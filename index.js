var carbonFootprint, carbonIntensity, energy, runningTime, memoryPower, corePower, memoryAllocated, coreFactor, coreCount, PUE, codePower, systemPower, mySource, myBody, extractedMemory, extractedRunningTime;

const compiler = {"java": "https://godbolt.org/api/compiler/java1800/compile", "python": "https://godbolt.org/api/compiler/python310/compile"};

assemCode = "invokevirtual invokevirtual imul imul imul imul idiv idivinvokevirtualhjqbhjWBJ  istore_0 istore_0 istore_1 istore_2 istore_3 istore_3istore        4iload         4 dstore if if if if if if if goto goto";
var readT = 2484;

// pass string literal obtained by extracting assembly language code
// let string passed be asmbly
// extract execution time from the site 
function scanCode(asmbly)
{
    var z;
    // z is for determining the load and store number
    var c=1;
    //counter
    var i=0,j=0;
    //loop variable
    var memory=0;
    // to calculate memory
    var load=0,store=0,gotos=0,ifs=0,printing=0,mul=0,div=0;
    // to optimise
    var di=0,dl=0,df=0,dd=0;
    // int , long , float , double 
    //to calculate memory from data types in bytes taking max cap of only 4 data types 
    //since boolean and char is not distinguishable in assembly language
    //check letter before store and increment d's
    //find load , store , gotos , ifs and increment
    for (i=0;i< asmbly.length;i++)
    {
            if(asmbly[i] == 'g')
            {
                if(asmbly.substr(i,4)=="goto")
                {
                    gotos++;
                }
            }
            else if(asmbly[i] == 'l')
            {
                if(asmbly.substr(i,4)=="load")
                {
                    z=(load<4)?5:14;
                    if(parseInt(asmbly.charAt(i+z))==load)
                    {
                        load++;
                    }
                }
            }
            else if(asmbly[i] == 's')
            {
                if(asmbly.substr(i,5)=="store") //14
                {
                    z=(store<4)?6:14;
                    if(parseInt(asmbly.charAt(i+z))==store)
                    {
                        store++;
                        if(asmbly[i-1]=='i')
                        {
                            di++;
                        }
                        if(asmbly[i-1]=='f')
                        {
                            df++;
                        }
                        if(asmbly[i-1]=='d')
                        {
                            dd++;
                        }
                        if(asmbly[i-1]=='l')
                        {
                            dl++;
                        }
                    }
                }
            }
            else if(asmbly[i] == 'i')
            {
                if(asmbly.substr(i,2)=="if")
                {
                    ifs++;
                }
                if(asmbly.substr(i,13)=="invokevirtual")
                {
                    printing++;
                }
                if(asmbly.substr(i,4)=="idiv")
                {
                    div++;
                }
                if(asmbly.substr(i,4)=="imul")
                {
                    mul++;
                }
            }
    }
    memory=(di*4)+(dl*8)+(df*4)+(dd*8);
    //total memory in bytes

    //starting optimisation :
    document.write("<b>Recomendation for optimisation:</b> <br><br>")
    // finding if there is a loop
    if(gotos==1)
    {
        document.write(c+" : <b>There is 1 loop </b>in the submitted code , convert it into a recursion call if possible <br><br>");
        c++;
    }
    //finding if there are multiple loops
    if(gotos>1)
    {
        document.write(c+" :<b> There are "+gotos+" loop </b>in the submitted code , convert a loop into a recursion call if possible , and try to group the tasks of loops under lesser number of loops if possible<br><br>");
        c++;
    }
    // finding if statement
    if(ifs==1)
    {
        document.write(c+" : <b>There is 1 if-statement </b>in the submitted code , convert it into a ternary conditional operator if possible <br><br>");
        c++;
    }
    //finding multiple if statements
    if(ifs>1)
    {
        document.write(c+" : <b>There are "+ifs+" if-statements </b>in the submitted code , convert it into a ternary conditional operator if possible , use ( if-else if ) instead of multiple if-statements if not implemented already, implement switch case instead of multiple if-statements if possible <br><br>");
        c++;
    }
    //checking useless variable
    if(store>load)
    {
        document.write(c+" : <b>There are "+(store-load)+" unused variables </b>in the code , try to remove these variables.<br><br>");
        c++;
    }
    //checking multiple print statements
    if(printing>1)
    {
        document.write(c+" : <b>There are "+printing+" print statements</b> in the submitted code , try to minimise print statements and print in lesser print statements using newline characters if possible <br><br>");
        c++;
    }
    //strength reduction of division
    if(div>0)
    {
        document.write(c+" :<b> There are "+div+" division operations </b>in the submitted code , try to implement strength reduction and use logical right shifts (eg: num>>2) if possible <br><br>");
        c++;
    }
    //strength reduction of multiplication
    if(div>0)
    {
        document.write(c+" : <b> There are "+mul+" multiplication operations </b> in the submitted code , try to implement strength reduction and use logical left shifts (eg: num<<2) if possible <br><br>");
        c++;
    }
    return (memory);
    //memory required by code in bytes returned 
}

var extractedMem = scanCode(assemCode);

const userAction = async () => {
    const response = await fetch(compiler["java"], {
        method: 'POST',
        body: `{
            "source": "${mySource}",
            "compiler": "java1800",
            "options": {
              "userArguments": "",
              "compilerOptions": {
                "producePp": null,
                "produceGccDump": {},
                "produceOptInfo": false,
                "produceCfg": false,
                "produceLLVMOptPipeline": null,
                "produceDevice": false
              },
              "filters": {
                "binary": false,
                "execute": false,
                "intel": true,
                "demangle": true,
                "trim": false
              },
              "tools": [],
              "libraries": []
            },
            "lang": "java",
            "files": [],
            "bypassCache": false,
            "allowStoreCodeDebug": true
          }`,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const myJson = await response.json(); //extract JSON from the http response
    
    extractedMemory = scanCode(myJson);
}

function formula() {
    carbonIntensity = {"India": 270};

    runningTime = readT;
    memoryAllocated = extractedMem;

    memoryPower = 0.3725;   // (in Watts/GB) ref. research articles

    coreCount = 1;          // Assumption Standard
    coreFactor = 0.6;       // Assumption for subsystems
    corePower = 28;         // (in Watts) Specific for host system

    codePower = memoryPower * memoryAllocated * Math.pow(10, -9);
    systemPower = corePower * coreFactor * coreCount;

    PUE = 1 + (codePower / systemPower);

    energy = runningTime * (codePower + systemPower) * PUE * Math.pow(10, -9);

    carbonFootprint = carbonIntensity["India"] * energy;

    document.write("<br><br><h4>Carbon Footprint: " + carbonFootprint + "</h4><br><br>");
}

function trigger() {
    mySource = document.getElementById('wgd-cc-url').value;
    window.location.reload();
}

formula();