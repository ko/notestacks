function clickedClassHandler(name, callback)
{
    var allElements = document.body.getElementsByTagName("*");

    for (var x = 0, len = allElements.length; x < len; x++) {
        if (allElements[x].className == name) {
            allElements[x].onclick = handleClick;
        }
    }

    function handleClick() {
        var elemParent = this.parentNode;
        var parentChilds = elemParent.childNodes;
        var index = 0;

        for (x = 0; x < parentChilds.length; x++) {
            if (parentChilds[x] == this) {
                break;
            }

            if (parentChilds[x].className == name) {
                index++;
            }
        }
        callback.call(this, index);
    }
}

function changePost(i)
{
    replaceText(element, '<h2>plz</h2><p>omg</p>')
}


function makeEditable(elem)
{
    var childs = elem.childNodes;
    for (i in childs) {
        if (childs[i].nodeName == "H2") {
            childs[i].setAttribute('contenteditable', 'true');
            childs[i].setAttribute('onBlur', 'postJson(this);');
        }
        if (childs[i].nodeName == "P") {
            childs[i].setAttribute('contenteditable', 'true');
            childs[i].setAttribute('onBlur', 'postJson(this);');
        }
    }
}


function serializeStacks()
{

}

function serializePosts() 
{
   var stacks = document.getElementById('postit-stacks').getElementsByTagName('div');
   var stacks_array = new Array();
   var stack_array = new Array();
   var postit_obj = {};
   var stack_no = 0;
   var stacksElement;
   var postitNodes;
   var stacks_json;

   for (i in stacks) {
       stacksElement = stacks[i];
       if (stacksElement.className == 'postit-stack') {
           if (stack_no > 0) {
               stacks_array.push(stack_array);
           }
           stack_array = [];
           stack_no++;
       } else if (stacksElement.className == 'postit') {
           postit_obj = {};
           postitNodes = stacksElement.childNodes;
           for (j in postitNodes) {
               if (postitNodes[j].nodeName == 'H2') {
                   postit_obj['title'] = postitNodes[j].innerHTML;
               } 
               if (postitNodes[j].nodeName == 'P') {
                   postit_obj['body'] = postitNodes[j].innerHTML;
               }
           }
           stack_array.push(postit_obj);
       }
   }

   if (stack_no == 1) {
       stacks_array.push(stack_array);
   }
   //console.log(stacks_array);
   stacks_json = JSON.stringify(stacks_array);
   console.log(stacks_json);
}

function loadJson()
{
    var url = 'http://notes.yaksok.net/api/list/get/';
    var obj = null;
    var thehtml;
    
    $.getJSON(url, function(data) {
            var items = [];
            // {notes_list: Array[n]}
            $.each(data, function(k, v) {
                // [Object, Object, ..., Object]
                $.each(v, function(i, value) {
                    // Object
                    thehtml = '';
                    thehtml += '<div class="postit" data-postid=' + value['id'] + '>';
                    thehtml += '<h2 contenteditable="true" onBlur="postJson(this);">' + value['title'] + '</h2>';
                    thehtml += '<p contenteditable="true" onBlur="postJson(this);">' + value['body'] + '</p>';
                    thehtml += '</div>';
                    items[items.length] = thehtml;
                    });
                });
                $('.postit-stack').append(items.join(''));
            });
}

function postJson(elem)
{
    var url = 'http://notes.yaksok.net/api/list/set/';
    var obj = null;
    var pid = $(elem).parent().attr('data-postid');
    var ptitle = $(elem).html();
    var pbody = $(elem).html();
    console.log(pid);
    console.log(elem);
    console.log(ptitle);
    var posting = { type: 1, stackid: 1, noteid: pid, title: ptitle, body: pbody };
   
    $.post(url, posting, function(data) {
            console.log(posting);
            });

    console.log('postJson returning');
}

function updateLastClicked(e)
{
    console.log(e.index());
}

$(document).ready(function() {

    clickedClassHandler("postit", function(index) {
        makeEditable(this);
        });

    loadJson();

    //postJson();
});

