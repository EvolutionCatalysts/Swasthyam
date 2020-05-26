/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
  
const axios = require('axios');

function main(params) {
    if(params.action=="case_count"){
        
            return axios.get(`https://api.covid19api.com/summary`)
           .then((result) => {
                var data='';
          		const t=result.data.Global.TotalConfirmed;
          		//data+="Cases In World\n--------------\nTotal Confirmed: "+t+"\nTotal Recovered: "+result.data.Global.TotalRecovered+"\nTotal Deaths: "+result.data.Global.TotalDeaths;
          		//data+="<b>Cases In World</b><br>--------------<br>Total Confirmed: "+t+"<br>Total Recovered: "+result.data.Global.TotalRecovered+"<br>Total Deaths: "+result.data.Global.TotalDeaths;
          		data+=`<div class="card" style="border:solid;border-color:#8A2BE2;width: 15rem;"><div class="card-header"><b>Cases In World<b></div>
              		        <ul class="list-group list-group-flush">
                                <li class="list-group-item"><b>Total Confirmed:</b><br>${t}</li>
                                <li class="list-group-item"><b>Total Recovered:</b><br>${result.data.Global.TotalRecovered}</li>
                                <li class="list-group-item"><b>Total Deaths:</b><br>${result.data.Global.TotalDeaths}</li>
                            </ul></div>`;
          		 if(params.country == null)
                {
              		//data="<b>Cases In World</b><br>--------------<br>Total Confirmed: "+t+"<br>Total Recovered: "+result.data.Global.TotalRecovered+"<br>Total Deaths: "+result.data.Global.TotalDeaths;
              		
        	        return { message: data};
                }
                else
                {
                    for(var i=0;i<result.data.Countries.length;i++)
                    {
                        if(result.data.Countries[i].Country.toUpperCase()===params.country.toUpperCase() || result.data.Countries[i].CountryCode.toUpperCase()===params.country.toUpperCase())
                        {
                            //data+="<br>--------------<br><b>Cases In "+params.country+"</b><br>--------------<br>Total Confirmed: "+result.data.Countries[i].TotalConfirmed+"<br>Total Recovered: "+result.data.Countries[i].TotalRecovered+"<br>Total Deaths: "+result.data.Countries[i].TotalDeaths;
                            data+=`<br><div class="card" style="border:solid;border-color:#8A2BE2;width: 15rem;">
                            <div class="card-header">Cases In ${params.country} </div>
              		        <ul class="list-group list-group-flush">
                                <li class="list-group-item">Total Confirmed:<br>${result.data.Countries[i].TotalConfirmed}</li>
                                <li class="list-group-item">Total Recovered:<br>${result.data.Countries[i].TotalRecovered}</li>
                                <li class="list-group-item">Total Deaths:<br>${result.data.Countries[i].TotalDeaths}</li>
                            </ul></div>`;
                            return { message: data};
                        }
                    }
                    
                }
           
            });
       
        
    }
    else if(params.action=="help")
    {
        var data='';
       
        return axios.get(`https://api.rootnet.in/covid19-in/contacts`)
        .then((result) => {
        	
          		const p=result.data.data.contacts.primary.number.toString();
         		const tollfree=result.data.data.contacts.primary['number-tollfree'].toString();
         		var statename=params.state;
                var arr=result.data.data.contacts.regional;
         	    
         	    var stateno;
              for(var i=0;i<arr.length;i++)
              {
                if(arr[i].loc.toUpperCase() === statename.toUpperCase())
                {
                 	stateno = arr[i].number.toString();
                }
              }
                //data+=`Primary No:${p} <br> Toll Free No:${tollfree} <br> ${state} Help No:${stateno}`;
                
                data+=`<div class="card" style="border:solid;border-color:#8A2BE2;width: 15rem;">
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item"><b>Primary No :</b><br>${p}</li>
                        <li class="list-group-item"><b>Toll Free No :</b><br>${tollfree}</li>
                        <li class="list-group-item"><b>${statename} Help No :</b><br>${stateno}</li>
                      </ul>
                </div>`;
          	
         	    return {message: data};
         		
        })
        .catch(err => {
          // Do something for an error here
        });
        
    }
    else if(params.action=="news")
    {
        var data='';
         return axios.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=94a4a233108b4604971e21d46b8c929a`)
           .then((result) => {
               for(var i=0;i<result.data.articles.length;i++)
               {
                       //data+=`\n${i+1}]${result.data.articles[i].title}\n`;
                       data+=`<div class="card" style="border:solid;border-color:#8A2BE2;width: 15rem;">
                                <img class="card-img-top" src="${result.data.articles[i].urlToImage}" alt="Card image cap">
                                <div class="card-body">
                                <p class="card-text">${result.data.articles[i].title}</p>
                                </div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><a href="${result.data.articles[i].url}" class="card-link" target="_blank">Read More</a></li>
                                </ul></div><br>`
                       
               }
                
                return { message: data};
           });
    }
    else if(params.action == "grocery"){
        
        return axios.get(`https://api.covid19india.org/resources/resources.json`)
            .then((result) => {
             var info = result.data.resources;
             var cityname=params.city;
             var data='<div class="card" style="border:solid;border-color:#8A2BE2;width: 15rem;"><ul class="list-group list-group-flush">';
                      
             for(var i=0;i< info.length ;i++)
            {
                //console.log(info[i].category);
               if(info[i].category === "Delivery [Vegetables, Fruits, Groceries, Medicines, etc.]" && info[i].city.toUpperCase() === cityname.toUpperCase()){
                // data+= info[i].nameoftheorganisation + ' : '+info[i].phonenumber  ;
                 data+=`<li class="list-group-item"><b>${info[i].nameoftheorganisation}</b> :<br>${info[i].phonenumber}</li>`;
                  
                }
            }
          data+=`</ul> </div>`;
              return {message: data};
         		
        })
        .catch(err => {
          // Do something for an error here
        });
        
    }
    else if(params.action == "free_food"){
        return axios.get(`https://api.covid19india.org/resources/resources.json`)
        .then((result) => {
            var info = result.data.resources;
      	    var cityname=params.city;
      
      	    var data='<div class="card" style="border:solid;border-color:#8A2BE2;width: 15rem;"><ul class="list-group list-group-flush">';
      	    var count = 5;
             for(var i=0;i< info.length;i++)
            {
                //console.log(info[i].category);
                
               if(info[i].category === "Free Food" && info[i].city.toUpperCase() === cityname.toUpperCase()){
                 //data+=' <a href='+info[i].contact+' target="_blank">'+info[i].nameoftheorganisation+'</a>'+ ' : '+info[i].phonenumber;
                 data+=`<li class="list-group-item"><a href=${info[i].contact} target="_blank"><b>${info[i].nameoftheorganisation}</b> :</a><br>${info[i].phonenumber}</li>`;
                 count--;
                  }
                  if(count ==0)
                  {
                      break;
                  }
            }
             data+=`</ul> </div>`;
             return {message: data};
        })
        .catch(err => {
          // Do something for an error here
        });
    }
    else if(params.action == "joke"){
        return axios.get(`https://official-joke-api.appspot.com/jokes/random`)
        .then((result) => {
            var data='<div class="card" style="border:solid;border-color:#8A2BE2;width: 15rem;"><ul class="list-group list-group-flush">';
            data+=`<li class="list-group-item"><b>${result.data.setup}</b></a><br>${result.data.punchline}</li></ul> </div>`;
          
             return {message: data};
        })
        .catch(err => {
          // Do something for an error here
        });
    }
    else if(params.action == "testing_location"){
        
        return axios.get(`https://api.covid19india.org/resources/resources.json`)
            .then((result) => {
             var info = result.data.resources;
             var cityname=params.city;
             var data='<div class="card" style="border:solid;border-color:#8A2BE2;width: 15rem;"><ul class="list-group list-group-flush">';
                      
             for(var i=0;i< info.length ;i++)
            {
                //console.log(info[i].category);
               if(info[i].category === "CoVID-19 Testing Lab" && info[i].city.toUpperCase() === cityname.toUpperCase()){
                // data+= info[i].nameoftheorganisation + ' : '+info[i].phonenumber  ;
                 data+=`<li class="list-group-item"><a href=${info[i].contact} target="_blank"><b>${info[i].nameoftheorganisation}</b> :</a><br>${info[i].phonenumber}</li>`;
                }
            }
          data+=`<li class="list-group-item"><b>For More Info Call :</b><br>1075</li></ul> </div></ul> </div>`;
              return {message: data};
         		
        })
       
        .catch(err => {
          // Do something for an error here
        });
        
    }
    else if(params.action == "zone"){
        return axios.get(`https://api.covid19india.org/zones.json`)
            .then((result) => {
                var cityname=params.city;
              	for(var i=0;i<result.data.zones.length;i++)
                {
                  	if(result.data.zones[i].district.toUpperCase() === cityname.toUpperCase())
                  	{
                  		if(result.data.zones[i].zone === "Red"){
                  		    data=`<button type="button" class="btn btn-outline-danger" disabled>Red Zone</button>`;
                  		}
                  		else if(result.data.zones[i].zone === "Orange"){
                  		    data=`<button type="button" class="btn btn-outline-warning" disabled>Orange Zone</button>`;
                  		}
                  		else if(result.data.zones[i].zone === "Green"){
                  		   data=  `<button type="button" class="btn btn-outline-success" disabled>Green Zone</button>`;

                  		}
                  		break;
                  	}
                }
                 return {message: data};
        })
        .catch(err => {
              // Do something for an error here
        });
    }
    
    
    else{
        return { message: 'Hello Worl' };
    }
}
