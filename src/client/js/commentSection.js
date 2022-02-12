const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const removeBtnAll = document.querySelectorAll(".remove-btn");

const deleteComment = (commentId) => {
  const commentAll = document.querySelectorAll(".video__comment");
  let comment = [];
  commentAll.forEach((e) => {
    comment.push(e.dataset.id);
  });
  comment.forEach((id) => {
    if (id === commentId.target.parentNode.dataset.id) {
      commentId.target.parentNode.style.display = "none";
    }
  });
};

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.classList = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text.length < 15 ? text : text.slice(0, 15) + "..."}`;
  const span2 = document.createElement("span");
  span2.classList.add("remove-btn");
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);

  const removeBtn = document.querySelector(".remove-btn");
  removeBtn.addEventListener("click", handleDelete);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  const commentList = event.target.parentNode;
  const commentId = commentList.dataset.id;
  const videoId = videoContainer.dataset.id;
  const response = await fetch(`/api/videos/${commentId}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      videoId,
    }),
  });
  console.log(response.status);
  if (response.status === 204) {
    deleteComment(event);
  }
  if (response.status === 403) {
    alert("you're not the owner");
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (removeBtnAll) {
  for (const removeBtn of removeBtnAll) {
    removeBtn.addEventListener("click", handleDelete);
  }
}
