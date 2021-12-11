// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5IMF1swlixzZPB3hBsTTABIT5KBHmms4",
  authDomain: "teamintroduce-bd4ca.firebaseapp.com",
  projectId: "teamintroduce-bd4ca",
  storageBucket: "teamintroduce-bd4ca.appspot.com",
  messagingSenderId: "4746707129",
  appId: "1:4746707129:web:e25daa30af733905171b68"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function(){
    $('.project-participants__add').on('click',function(){
      addIssue(this);
    } );
});

  function addIssue(button){
    let addIssue = $(`
    <div class='task' name='temptask' style=' border: 3px dashed black;'>
       <div class='inputTask'>
         <div><label for='status'>Status</label><input style='font-weight:bold; color:brown' id="status" name="status" type="text" value=${$(button).val()} disabled></div>
         <div><label for='issueType'>IssueType</label> <select id='issueType'><option value="Idea" selected>Idea</option><option value="Bug">Bug</option><option value="Task" >Task</option></select></div>
         <div><label for='issueContent'>Content</label> <textarea id= 'issueContent' name='issueContent'></textarea></div>
         <div><label for='priority'>Priority</label>  <select id='priority'><option value="Critical">Critical</option><option value="Minor" selected>Minor</option><option value="Trivial" >Trivial</option></select></div>
         <div><label for='owner'>Owner</label> <input id="owner" name="owner" type="text"></div>
         <div><label for='createDate'>Created</label> <input id="createDate" name="createDate" type="date" disabled></div>
         <div><label for='dueDate'>Due</label> <input id="dueDate" name="dueDate" type="date"></div>
       </div>
       <div class='inputTask-footer'>
       <div>
       </div>
       <div>
        <button class="cancel-button" onClick=cancelIssue(this)>Cancel</button>
        <button class="save-button" onClick=saveIssue(this)>Save</button>
       </div>
      
       </div>
     </div>`);

    if($('[name=temptask]').length > 0){
      let result =  confirm('There is a job being created, would you like to delete it and create a new one?');
      if(result== true){
        $('[name=temptask]').remove();
        $(button).parents('.project-column').append(addIssue);
      }
    }else{ 
  
       $(button).parents('.project-column').append(addIssue);
    }
    let currDate = new Date();
    currDate.setHours(currDate.getHours()+9)
    $('#createDate').val(currDate.toISOString().substring(0,10)) ;
  
  }
  function cancelIssue(button){
    $(button).parents('.task').remove();
  }

  function saveIssue(button){
    const db = firebase.firestore();

    
    $('.validlabel').remove();
    let validate = true;
    $(button).parents('.task').find("input").each(function(index,input){
      if(validateInput($(input).attr('name'))== false){
            validate = false;
      }    
    })
    if(validateInput("issueContent") ==false){
      validate = false;
    }
    if(validate){  
      let issueObject ={
        status:$('#status').val(),
        issueType:$('#issueType').val(),
        issueContent:$('#issueContent').val(),
        priority:$('#priority').val(),
        owner:$('#owner').val(),
        createDate:$('#createDate').val(),
        dueDate:$('#dueDate').val(),
      }
      db.collection('kanbanIssue').add(issueObject).then((result) => {

        let priorityClass= ""
        if(issueObject.priority == "Critical"){
          priorityClass = "task__priority_red";
        }else if(issueObject.priority == "Minor"){
          priorityClass = "task__priority_yellow";
        }else if(issueObject.priority == "Trivial"){
          priorityClass = "task__priority_green";
        }
        let template = `<div class='task' draggable='true' id='${result.id}''>
          <div class='task__tags'>
            <span class='task__tag task__tag--${issueObject.issueType}'>${issueObject.issueType}</span>  <span class='owner_tag'>Owner : ${issueObject.owner}</span>      
            <button class='task__options'><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M16 12c0-1.656 1.344-3 3-3s3 1.344 3 3-1.344 3-3 3-3-1.344-3-3zm1 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm-8 0c0-1.656 1.344-3 3-3s3 1.344 3 3-1.344 3-3 3-3-1.344-3-3zm1 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm-8 0c0-1.656 1.344-3 3-3s3 1.344 3 3-1.344 3-3 3-3-1.344-3-3zm1 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2z"/></svg></button>
          </div>
          <p>${issueObject.issueContent}</p>
          <div class='task__stats'>
            <span>Start <i class="fas fa-flag"></i>${issueObject.createDate}</span>
            <span>Due <i class="fas fa-comment"></i>${issueObject.dueDate}</span>
                    
            <span class='${priorityClass}'></span>
          </div>
          </div>
        </div>`
        $('.project-column[name='+issueObject.status +']').append(template);

        $(button).parents('.task').remove();
      }).catch((err)=>{
          console.log(err);
      })
    }
  }

  (function loadIssue(){
    const db = firebase.firestore();
    db.collection('kanbanIssue').get().then((snapshot)=>{
      
        let i =0;
        snapshot.forEach((doc)=>{
            let priorityClass= ""
            if(doc.data().priority == "Critical"){
              priorityClass = "task__priority_red";
            }else if(doc.data().priority == "Minor"){
              priorityClass = "task__priority_yellow";
            }else if(doc.data().priority == "Trivial"){
              priorityClass = "task__priority_green";
            }
            let template = `<div class='task' draggable='true' id='${doc.id}''>
              <div class='task__tags'>
                <span class='task__tag task__tag--${doc.data().issueType}'>${doc.data().issueType}</span>  <span class='owner_tag'>Owner : ${doc.data().owner}</span>      
                <button class='task__options'><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M16 12c0-1.656 1.344-3 3-3s3 1.344 3 3-1.344 3-3 3-3-1.344-3-3zm1 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm-8 0c0-1.656 1.344-3 3-3s3 1.344 3 3-1.344 3-3 3-3-1.344-3-3zm1 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm-8 0c0-1.656 1.344-3 3-3s3 1.344 3 3-1.344 3-3 3-3-1.344-3-3zm1 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2z"/></svg></button>
              </div>
              <p>${doc.data().issueContent}</p>
              <div class='task__stats'>
                <span>Start <i class="fas fa-flag"></i>${doc.data().createDate}</span>
                <span>Due <i class="fas fa-comment"></i>${doc.data().dueDate}</span>
                         
                <span class='${priorityClass}'></span>
              </div>
              </div>
            </div>`
            $('.project-column[name='+doc.data().status +']').append(template);
      

        })

        bindingEvent();
  })
})();



function bindingEvent(){
  
    var dragSrcEl = null;
    var beforeStatus = "";
      
    function handleDragStart(e) {
      this.style.opacity = '0.1';
      this.style.border = '3px dashed #c4cad3';
      
      dragSrcEl = this;
      beforeStatus = $(dragSrcEl).parents('.project-column').attr('name');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      if($(this).find(dragSrcEl).length == 0){
        this.classList.add('task-hover');
      }
    
      e.dataTransfer.dropEffect = 'move';
      
      return false;
    }

    function handleDragEnter(e) {
      this.classList.add('task-hover');
    }

    function handleDragLeave(e) {
      this.classList.remove('task-hover');
    }

    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      
      if (dragSrcEl != this) {
        $(this).append(dragSrcEl);
        
        $('.project-column').removeClass('task-hover')
    
        let targetStatus = $(this).attr('name');
        if(beforeStatus != targetStatus) {
          updateStatus(dragSrcEl, targetStatus);
        }
     
      }
      
      return false;
    }

    function handleDragEnd(e) {
      this.style.opacity = '1';
      this.style.border = '3px dashed transparent';
      
      items.forEach(function (item) {
        item.classList.remove('task-hover');
      });
      
    }

    $('.task__options').on('click',function(){
        editFormIssue(this);
       
    })

    $('.task').dblclick(function(){
       editFormIssue($(this).find('.task__options'));
    })
    
    let items = document.querySelectorAll('.task'); 
    items.forEach(function(item) {
      item.addEventListener('dragstart', handleDragStart, false);
      item.addEventListener('dragenter', handleDragEnter, false);
      item.addEventListener('dragleave', handleDragLeave, false);
      item.addEventListener('dragend', handleDragEnd, false);
    });

    let dropRange = document.querySelectorAll('.project-column'); 
    dropRange.forEach(function(item) {
      item.addEventListener('dragover', handleDragOver, false);
      item.addEventListener('drop', handleDrop, false);
    });



    
}

function validateInput(name){
 
  let x = $('[name='+name+']').val();   

 
  if (x.trim() == "") {
      let span = document.createElement("span");
      span.className  = "validlabel";
      span.innerHTML = "This field is required";
      $('[name='+name+']').css('border-color','red');
      $('[name='+name+']').parent().after(span);
      return false;
  } else {
    if(name == 'dueDate' && $('#createDate').val() > $('#dueDate').val()){     
      let span = document.createElement("span");
      span.className  = "validlabel";
      span.innerHTML = "Due date must be equal to or later than the creation date";
      $('[name='+name+']').css('border-color','red');
      $('[name='+name+']').parent().after(span);
      return false;
    }else{
      return true;
    }
  
  }
  
}


function deleteIssue(dom){
  let firebaseId = $(dom).parents('.task').attr('id');

  if(confirm('Are you sure you want to delete this?') == true){
    const db = firebase.firestore();
    db.collection('kanbanIssue').doc(firebaseId).delete().then(() => {
        cancelIssue(dom);
        globalTempMemory="";
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
  }
  
}


function updateIssue(button){
  const db = firebase.firestore();
  $('.validlabel').remove();
  let validate = true;
  $(button).parents('.task').find("input").each(function(index,input){
      $(input).css('border-color','gray');
     if(validateInput($(input).attr('name'))== false){
          validate = false;
     }    
  })
  if(validateInput("issueContent") ==false){
    validate = false;
  }
  
  if(validate){   
     
      let issueObject ={
          status:$('#status').val(),
          issueType:$('#issueType').val(),
          issueContent:$('#issueContent').val(),
          priority:$('#priority').val(),
          owner:$('#owner').val(),
          createDate:$('#createDate').val(),
          dueDate:$('#dueDate').val(),
      }

      let docId = $(button).parents('.task').attr('id');
      db.collection('kanbanIssue').doc(docId).update(issueObject).then((snapshot)=>{
          let priorityClass= ""
          if(issueObject.priority == "Critical"){
            priorityClass = "task__priority_red";
          }else if(issueObject.priority == "Minor"){
            priorityClass = "task__priority_yellow";
          }else if(issueObject.priority == "Trivial"){
            priorityClass = "task__priority_green";
          }
          let template = `<div class='task' draggable='true' id='${docId}''>
            <div class='task__tags'>
              <span class='task__tag task__tag--${issueObject.issueType}'>${issueObject.issueType}</span>  <span class='owner_tag'>Owner : </i>${issueObject.owner}</span>      
              <button class='task__options'><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M16 12c0-1.656 1.344-3 3-3s3 1.344 3 3-1.344 3-3 3-3-1.344-3-3zm1 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm-8 0c0-1.656 1.344-3 3-3s3 1.344 3 3-1.344 3-3 3-3-1.344-3-3zm1 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm-8 0c0-1.656 1.344-3 3-3s3 1.344 3 3-1.344 3-3 3-3-1.344-3-3zm1 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2z"/></svg></button>
            </div>
            <p>${issueObject.issueContent}</p>
            <div class='task__stats'>
              <span>Start <i class="fas fa-flag"></i>${issueObject.createDate}</span>
              <span>Due <i class="fas fa-comment"></i>${issueObject.dueDate}</span>
                      
              <span class='${priorityClass}'></span>
            </div>
            </div>
          </div>`
          $('.project-column[name='+issueObject.status +']').append(template);
          bindingEvent();
          $(button).parents('.task').remove();
      });
        
  }
}

function updateStatus(task, status){
  const db = firebase.firestore();
        
  let issueObject ={
    status:status
  }

  let docId = $(task).attr('id');
  db.collection('kanbanIssue').doc(docId).update(issueObject);
  return true;
}

var globalTempMemory ="";
function editFormIssue(dom){
  let firebaseId = $(dom).parents('.task').attr('id');
  globalTempMemory = $(dom).parents('.task').html();
  const db = firebase.firestore();
  db.collection('kanbanIssue').doc(firebaseId).get().then((snapshot)=>{
    let data = snapshot.data()
    let addIssue = $(`<div class='inputTask'>
         <div><label for='status'>Status</label>
         <select id='status'>
         <option value="Backlog">Backlog</option>
         <option value="InProgress">InProgress</option>
         <option value="Review" >Review</option>
         <option value="Done" >Done</option>
         </select></div>
         <div><label for='issueType'>IssueType</label> <select id='issueType'><option value="Idea">Idea</option><option value="Bug">Bug</option><option value="Task" >Task</option></select></div>
         <div><label for='issueContent'>Content</label> <textarea id= 'issueContent' name='issueContent'>${data.issueContent}</textarea></div>
         <div><label for='priority'>Priority</label>  
         <select id='priority'>
         <option value="Critical">Critical</option>
         <option value="Minor">Minor</option>
         <option value="Trivial" >Trivial</option>
         </select></div>
         <div><label for='owner'>Owner</label> <input id="owner" name="owner" type="text" value=${data.owner}></div>
         <div><label for='createDate'>Created</label> <input id="createDate" name="createDate" type="date" disabled value=${data.createDate}></div>
         <div><label for='dueDate'>Due</label> <input id="dueDate" name="dueDate" type="date" value=${data.dueDate}></div>
       </div>
       <div class='inputTask-footer'>
       <svg class='trashIcon' xmlns="http://www.w3.org/2000/svg" onclick=deleteIssue(this) width="25" height="25" fill="red" class="bi bi-trash-fill" viewBox="0 0 16 16">
      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
    </svg>
          <div>
            <button class="cancel-button" onClick=restoreIssue(this)>Cancel</button>
          <button class="save-button" onClick=updateIssue(this)>Save</button>
          <div>
         
       </div>`);
       addIssue.find("option[value="+data.priority+"]").attr("selected",true)
       addIssue.find("option[value="+data.issueType+"]").attr("selected",true)
       addIssue.find("option[value="+data.status+"]").attr("selected",true)
   
      $(dom).parents('.task').html(addIssue);
  })

}

function restoreIssue(dom){
  $(dom).parents('.task').html(globalTempMemory);
  globalTempMemory= "";
  bindingEvent();
}