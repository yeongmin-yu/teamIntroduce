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

    var dragSrcEl = null;
    
    function handleDragStart(e) {
      this.style.opacity = '0.1';
      this.style.border = '3px dashed #c4cad3';
      
      dragSrcEl = this;
  
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
         <label for='issueContent'>Content</label> <textarea id= 'issueContent'></textarea>
         <div><label for='priority'>Priority</label>  <select id='priority'><option value="Critical">Critical</option><option value="Minor" selected>Minor</option><option value="Trivial" >Trivial</option></select></div>
         <div><label for='owner'>Owner</label> <input id="owner" name="owner" type="text"></div>
         <div><label for='createDate'>Created</label> <input id="createDate" name="createDate" type="date" disabled></div>
         <div><label for='dueDate'>Due</label> <input id="dueDate" name="dueDate" type="date"></div>
       </div>
       <div class='inputTask-footer'>
         <button class="cancel-button" onClick=deleteIssue(this)>Cancel</button>
         <button class="save-button" onClick=saveIssue(this)>Save</button>
       </div>
     </div>`);

    if($('[name=temptask]').length > 0){
      let result =  confirm('작성중인 Task가 있습니다, 삭제하시고 새로 만드시겠습니까?');
      if(result== true){
        $('[name=temptask]').remove();
        $(button).parents('.project-column').find('.task').eq(0).before(addIssue);
      }
    }else{ 
  
       $(button).parents('.project-column').find('.task').eq(0).before(addIssue);
    }
    let currDate = new Date();
    currDate.setHours(currDate.getHours()+9)
    $('#createDate').val(currDate.toISOString().substring(0,10)) ;
  
  }
  function deleteIssue(button){
    $(button).parents('.task').remove();
  }

  function saveIssue(button){
    const db = firebase.firestore();

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
        console.log(result);
    
        window.location.reload();
      }).catch((err)=>{
          console.log(err);
      })
  }