const url = document.getElementById("url");
const output = document.getElementById("output-container");

function GetVideo() {
  if (url.value.trim() === "") {
    ErrorMessage("URL is required and cannot be empty!");
    return;
  }

  fetch(
    `https://youtube-video-converter.herokuapp.com/getVideo?URL=${url.value}`,
    { method: "GET" }
  )
    .then((req) => req.json())
    .then((res) => {
      if (res.errorMessage) {
        ErrorMessage(res.errorMessage);
        return;
      }

      let videoDetails = res.videoDetails;
      let thumbnail =
        res.videoDetails.thumbnails[res.videoDetails.thumbnails.length - 1];

      OutputContainer(
        videoDetails.title,
        thumbnail.url,
        videoDetails.likes,
        videoDetails.viewCount,
        videoDetails.publishDate
      );

      url.value = "";
    });
}

function DownloadVideoOrAudio(URL, title, type) {
  window.location.href = `https://youtube-video-converter.herokuapp.com/download?URL=${URL}&title=${title}&type=${type}`;
}

function ErrorMessage(message) {
  const errorOutput = document.getElementById("error");
  errorOutput.innerText = "Error: " + message;
  output.innerHTML = "";

  let timeout = setTimeout(() => {
    errorOutput.innerText = "";
    clearTimeout(timeout);
  }, 2000);
}

function FormatPublishDate(publishDate) {
  const fullMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let date = new Date(publishDate.toString());

  let day = date.getDate();
  let month = fullMonth[date.getMonth()];
  let year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

function OutputContainer(title, thumbnailURL, likes, viewCount, publishDate) {
  output.innerHTML = `<p class="font-semibold text-xl w-[500px] text-center truncate"><abbr class="no-underline" title="${title}">${title}</abbr></p>
  <img
    src=${thumbnailURL}
    class="w-[500px] mt-2 border-2 border-blue-500"
  />
  <div
    class="relative px-2 flex justify-between items-center w-[100%] mt-2"
  >
    <p class="text-lg">
      <i class="bi bi-hand-thumbs-up-fill text-blue-500"></i> ${likes.toLocaleString()}
    </p>
    <p class="text-lg absolute left-[50%] translate-x-[-50%]">
      <i class="bi bi-eye-fill text-blue-500"></i> ${parseInt(
        viewCount
      ).toLocaleString()}
    </p>
    <p class="text-lg">
      <i class="bi bi-calendar-fill text-blue-500"></i> ${FormatPublishDate(
        publishDate
      )}
    </p>
  </div>
  <div class="flex justify-center items-center">
    <button
      class="h-12 w-26 p-2 mt-5 ml-1 border-2 border-blue-500 text-white bg-blue-500 hover:shadow-lg transition-all delay-2"
      onclick="DownloadVideoOrAudio('${url.value}', '${title}', 'video')"
    >
      Download 360p MP4
    </button>
    <button
      class="h-12 w-26 p-2 mt-5 ml-1 border-2 border-blue-500 text-white bg-blue-500 hover:shadow-lg transition-all delay-2"
      onclick="DownloadVideoOrAudio('${url.value}', '${title}', 'audio')"
    >
      Download MP3
    </button>
  </div>
  
  `;
}
