const fs = require("fs");
const axios = require("axios");
var prompt = require("prompt");


init();
function init() {
var prompt_attributes = [
    {
        message:"Enter your git username:",
        name: 'username',
    },
    {
       message:"Enter background color:",
        name: 'color',
    }
];

    prompt.get(prompt_attributes, function (err, result) {
        if (err) {
            console.log(err);
            return 1;
        }else {
            var username = result.username;
            var color = result.color;
        }
        var queryUrlForStarCount=`https://api.github.com/users/${username}/starred?per_page=100`;
        axios.get(queryUrlForStarCount).then(function(res){
            var starCount= res.data.length;

        const url=`https://api.github.com/users/${username}`;
        axios.get(url).then(function(res){

            var location=res.data.location;
            var locationUrl="#";
            if(location!=null){
                var city=res.data.location.slice(0,res.data.location.indexOf(","));
                var state=res.data.location.slice(res.data.location.indexOf(",")+1);
                locationUrl=`https://www.google.com/maps/place/${city},%2520${state}/@38.8430769,-77.1142659,15z/data=!3m1!4b1`;
            }
     
         var obj={
             name: res.data.name,
             company:res.data.company,
             location: location,
             locationUrl:locationUrl,
             gitUrl:res.data.html_url,
             blog:res.data.blog,
             bio:res.data.bio,
             avatar:res.data.avatar_url,
             public_repos:res.data.public_repos,
             followers:res.data.followers,
             following: res.data.following,
             starCount:starCount
            }

       var html=getHtml(obj, color);

         fs.writeFile("profile.html", html, function(err){
            if(err){
                throw err;
            }
            console.log(`Saved profile html file.`);
            pdfConvert();
        })
        })

    })
   
       
    })

}

    


const colors = {
    green: {
      wrapperBackground: "#E6E1C3",
      headerBackground: "#C1C72C",
      headerColor: "black",
      photoBorderColor: "black"
    },
    blue: {
      wrapperBackground: "#5F64D3",
      headerBackground: "#26175A",
      headerColor: "white",
      photoBorderColor: "#73448C"
    },
    pink: {
      wrapperBackground: "#879CDF",
      headerBackground: "#FF8374",
      headerColor: "white",
      photoBorderColor: "#FEE24C"
    },
    red: {
      wrapperBackground: "#DE9967",
      headerBackground: "#870603",
      headerColor: "white",
      photoBorderColor: "white"
    }
  };
  



function getHtml(obj, color){
    return `<html>
    <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <style>
    
#header {
    background: ${colors[color].wrapperBackground};
    height: 340px;
    width: 620px;
    padding-top: 50px;
}
#footer{
    background:${colors[color].wrapperBackground};
    margin-top: 60px;
    height: 130px;
}

#secondHeader {
    background: ${colors[color].headerBackground};
    font-size: 17px;
    text-align: center;
    width: 88%;
    padding-top: 150px;
    height: 275px;
    margin-top: 40px;
    margin-left: 4%;
    line-height: 2;
}

img {
    border: 3px solid ${colors[color].photoBorderColor};
    margin-top: -200px;
    height: 150px;
    border-radius: 52%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
}
a{
    color:${colors[color].headerColor};
    margin-right: 10px;
}

#WGB{
   text-align: center;
}


#job {
    margin-top: 50px;
    color: black;
    margin-left: 20%;
}

.col-md-2 {
    float: left;
    width: 250px;
    background-color: ${colors[color].headerBackground};
    padding-top:15px;
    text-align: center;
    border-radius: 10px;
    margin: 10px;
    height: 80px;
   
}

.tab{
    margin-top: 30px;
  height: 200px;
  margin-left: 30px;
  width: 60%;
}

i{
    color: white;
}



            </style>
    </head>
    <body>
        <div id="header">
                <div id="secondHeader">
                        <img src="${obj.avatar}" alt="Frog">
                        <div><b>Hi!</b></div>
                        <div><b>My name is ${obj.name}!</b></div>
                        <div>Currently @ ${obj.company}</div>
                        <div id="WGB">
                        <i class="fas fa-location-arrow"></i>
                         <a href="${obj.locationUrl}">${obj.location}</a>
                         <i class="fab fa-github"></i>
                         <a href=${obj.gitUrl}>GitHub</a>
                         <i class="fas fa-rss"></i>
                         <a href=${obj.blog}>Blog</a>
                        </div>
                </div>
        </div>

        <h5 id="job">${obj.bio}</h5>
        
<div class="tab">
        <div class="col1 col-md-2">Public Repositories <br> ${obj.public_repos}</div>
        <div class="col2 col-md-2"><div>Followers <br> ${obj.followers}</div></div>

                <div class="col1 col-md-2"><div>GitHub Stars<br>${obj.starCount}</div></div>
                <div class="col2 col-md-2"><div>Following <br> ${obj.following}</div></div>


    </div>
        <div id="footer"></div>
    </div>
    <script src="https://use.fontawesome.com/releases/v5.12.0/js/all.js" data-auto-replace-svg="nest"></script>
    </body>
</html>`;
}

function pdfConvert(){
var pdf = require('html-pdf');
var html = fs.readFileSync('/Users/tsolmon/Downloads/homework7/Assets/Profile.html', 'utf8');
var options = { format: 'a4' };
 
pdf.create(html, options).toFile('./DeveloperPortfolio.pdf', function(err) {
  if (err) return console.log(err);
});
}