let apiKey = "AIzaSyASVpo2AyEnnT0ybVazetHLlrZswL5ljXg";
let baseURL = "https://www.googleapis.com/youtube/v3";
const videoId = JSON.parse(localStorage.getItem('videoID'));
console.log("Video ID: ", videoId.videoId);

async function fetchDetails(id){
    
    let url =`${baseURL}/videos?key=${apiKey}&id=${id}&part=snippet,statistics`;
    let response = await fetch(url,{method:"GET"});
    let result = await response.json();
     
    return result;
}

async function getChannelInfo(id){
  let url =`${baseURL}/channels?key=${apiKey}&part=snippet,statistics&id=${id}`;
  let response = await fetch(url,{method:"GET"});
    let result = await response.json();
    
    return result;
}

async function getComments(id){
   let url = `${baseURL}/commentThreads?part=snippet&videoId=${id}&key=${apiKey}&maxResults=50&order=time`;

   let response = await fetch(url,{method:"GET"});
   let result = await response.json();
  
   return result;
}

async function getReplies(id)
{  
    let url = `${baseURL}/comments?part=snippet&parentId=${id}&key=${apiKey}&maxResults=10`;
    let response = await fetch(url,{method:"GET"});
    let result = await response.json();
    console.log(result.items);

   addRepliesToCard(result.items,id);
}

async function getMoreVideos(query)
{
    
    let url = `${baseURL}/search?key=${apiKey}&q=${query}&part=snippet&maxResults=20`;
    let response = await fetch(url, { method: 'GET' });
    let result = await response.json();
    console.log(result);
    return result.items;
}

function nFormatter(num) {
    if (num >= 1000000000) {
       return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
       return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
       return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}


const detailScreen = document.getElementById("detailScreen");

async function getInfo(){
        
    const data = await fetchDetails(videoId.videoId);
    console.log(data);
    const pic = data.items[0].snippet.thumbnails.medium.url;
    const title = data.items[0].snippet.title;
    const channelTitle = data.items[0].snippet.channelTitle;
    const description = data.items[0].snippet.description;
    const channelId = data.items[0].snippet.channelId;
    const channelInfo = await getChannelInfo(channelId);
    const channelImg = channelInfo.items[0].snippet.thumbnails.high.url;
    const subscribers = nFormatter(channelInfo.items[0].statistics.subscriberCount);

    let commentInfo = await getComments(videoId.videoId);
   
   
   const arr = commentInfo.items;

    const views = nFormatter(data.items[0].statistics.viewCount);
    const likes = nFormatter(data.items[0].statistics.likeCount);
    //console.log(views,likes);
     detailScreen.innerHTML=
     ` <div id="video-player">
     <div id="img-cont">
        
         <iframe
         id="youtube-player"
         width="100%"
         height="550"
         src="https://www.youtube.com/embed/${videoId.videoId}"
         frameborder="0"
         allowfullscreen
         
     ></iframe>
     </div>
   </div>
   <div id="title">
    <p>${title}</p>
    <div id="content">
      <div id="views">
         <p>${views} views</p>
         <p>.</p>
         <p>Oct 8,2021</p>
      </div>

      <div id="likes">
         <div id="like">
             <span class="material-symbols-outlined">
                 thumb_up
                 </span>
                 <p>${likes}</p>
                 </div>

                 <div id="download">
                 <span class="material-symbols-outlined">
                     download
                 </span>
                 <p>Download</p>
                 </div>
      </div>
    </div> 

   </div>
   <div id="channel-info">

     <div id="container1">
         <div id="right">
       <div id="channel-logo">
         <img src="${channelImg}">
       </div>
       <div id="info">
           <p>${channelTitle}</p>
           <p style="font-family:'Poppins', sans-serif; color: lightgray;">${subscribers} Subscribers</p>
       </div>
       </div>

       <div id="btn">
         <button style="background-color: rgb(208, 16, 16); border:none">SUBSCRIBE</button>
      </div>
     </div>
       
     <div id="description">
         <p>${description}</p>
         <p id="show-more"><b>SHOW MORE</b></p>
     </div>
     
   </div>
   
   <div id="comments">
                <div id="head">
                    <p>${arr.length} Comments</p>
                    <div id="sort">
                        <span class="material-symbols-outlined">
                            sort
                            </span>
                            <b>SORT BY</b>
                    </div>
                </div>

               
                   <div id="yourComment">
                     <img src="./assets/Profile-pic.png">
                   
                     <p>Add a public comment...</p>
                    </div>
                   
                   

                
              </div>

            </div>`

   const container = document.createElement("div");
   container.id= "container-2";
   const comments = document.getElementById("comments");

  
   

   for(let i=0; i<arr.length; i++)
   {
       const profilePic = arr[i].snippet.topLevelComment.snippet.authorProfileImageUrl;
       const name= arr[i].snippet.topLevelComment.snippet.authorDisplayName;
       const comment = arr[i].snippet.topLevelComment.snippet.textDisplay;
       const likes= nFormatter(arr[i].snippet.topLevelComment.snippet.likeCount);
       const commentId = arr[i].id;
       const card = document.createElement("div");
       card.className = "comment-card";
       card.id = commentId;
       const replyCount = arr[i].snippet.totalReplyCount;

       card.innerHTML=
       `<div id="img1">
       <img src="${profilePic}">
    </div>
    <div id="comment-info">
       <div id="name-time">
           <p><b>${name}</b></p>
           <p id="time1">8 hours ago</p>
       </div>
       <div id="comment">
           <p>${comment}</p>
       </div>
       <div id="replies">
           <div id="like">
           <span style="font-size: 17px; color:rgba(201, 198, 198, 0.926) ;" class="material-symbols-outlined">thumb_up</span>
           <p  style="color: rgba(201, 198, 198, 0.926);">${likes}</p>
           </div>
           <div id="div1">
             <p id="reply" onclick="getReplies('${commentId}')" style="color: rgba(201, 198, 198, 0.926); ">REPLY</p>
             <span style="color: rgba(201, 198, 198, 0.926);">${replyCount}</span>
            </div>
           
       </div>
    </div>`

    container.appendChild(card);
    }
   comments.appendChild(container);


  const moreVideodata = await getMoreVideos(title);
  const sideScreen = document.getElementById("sideScreen");
  
  for(let i=0; i<moreVideodata.length; i++)
  {
      const card = document.createElement("div");
      const img = moreVideodata[i].snippet.thumbnails.medium.url;
      const title = moreVideodata[i].snippet.title;
      const channelTitle = moreVideodata[i].snippet.channelTitle;
      card.id = 'card'

      card.innerHTML=
      `<div id="imge">
      <img src="${img}" width="200px">
      <div id="time">
          <p>23:45</p>
      </div>
  </div>
  <div id="container2">
      <p id="moreVideoTitle" style="font-size: 19px;"><b>${title}</b></p>
      <p style="color: lightgray;">${channelTitle}</p>
      <div>
          <p>1M views</p>
          <p>.</p>
          <p>3 years ago</p>
      </div>
  </div>`

   sideScreen.appendChild(card);
  }
 }



getInfo();





function addRepliesToCard(arr,id)
{    
    const videocard = document.getElementById(`${id}`);
    const container = document.createElement("div");
    container.id = "containerReply";
    
    for(let i=0; i<arr.length; i++)
    {   
        const profilePic = arr[i].snippet.authorProfileImageUrl;
        const name = arr[i].snippet.authorDisplayName;
        const comment = arr[i].snippet.textDisplay;
        const like = nFormatter(arr[i].snippet.likeCount);

        const card = document.createElement("div");
        card.className="comment-card";

        card.innerHTML=
        `<div id="img1">
        <img src="${profilePic}">
     </div>
     <div id="comment-info">
        <div id="name-time">
            <p><b>${name}</b></p>
            <p id="time1">8 hours ago</p>
        </div>
        <div id="comment">
            <p>${comment}</p>
        </div>
        <div id="replies">
            <div id="like">
            <span style="font-size: 17px; color:rgba(201, 198, 198, 0.926) ;" class="material-symbols-outlined">thumb_up</span>
            <p  style="color: rgba(201, 198, 198, 0.926);">${like}</p>
            </div>
            <div id="div1">
            <p id="reply" style="color: rgba(201, 198, 198, 0.926); ">REPLY</p>
            <span style="color: rgba(201, 198, 198, 0.926);">10</span>
            </div>
        </div>

        
     </div>`

     container.appendChild(card);
    }
     
    videocard.insertAdjacentElement('afterend',container);
    
    
   
}
