
var selectedColor = "rgb(255, 250, 205)"
var alignedColor = "rgb(60, 179, 113)"//rgb(0, 200, 200)"
// var borderHighlighted = "3px solid black"
// var borderDefault = "1px dotted gray"

$(document).ready(function() {

    // getting input: copy-paste
    $('[contenteditable=true]').on('paste', function (e) {
        //console.log("pasting no format")
        e.preventDefault();
        var cd =  e.originalEvent.clipboardData;
        var content = cd.getData("text/plain")
        $(this).empty().append("<p>" + content + "</p>");
    });

    // unselect on content change
    $('[contenteditable=true]').on('focus', function() {
      before = $(this).children().length;
    }).on('blur keyup paste', function() {
      if (before != $(this).children().length) { $(this).trigger('change'); }
    });

    $("[contenteditable=true]").change(function() {
      //console.log("content changed");
      unselect()
    });

    function unselect(){
      $('tr td p[id]').filter(function() {
         return ( $(this).css('background-color') == selectedColor );
      }).css('background-color', alignedColor)

      $('tr td p').filter(function() { //the others in the selection
         return ( $(this).css('background-color') == selectedColor );
      }).css('background-color', 'inherit')

      //$('tr td p[id]').css('border', borderDefault)
      $('tr td p[id]').css('background-color', alignedColor)
    }

    function select(thisObj){
      if (thisObj.text().length > 0) { // ignore empty para
        if  (thisObj.css( "background-color")  == selectedColor) {
          //thisObj.css( "background-color", 'inherit')
        }
        else {
            thisObj.css( "background-color", selectedColor)
        }
      }
    }

    function text_unselect(){
      if (window.getSelection) { // All browsers, except IE <=8
        window.getSelection().removeAllRanges();
      } else if (document.selection) { // IE <=8
        document.selection.empty();
      }
    }

    function showSegmentStat(){
      segments1 = $('table tr td:nth-child(1) p').length;

      nbEmptyPara = 0
      $('table tr td:nth-child(1) p').each(function() {
        if ($(this).text()=="") {nbEmptyPara = nbEmptyPara + 1}
      })
      segments1 = segments1 - nbEmptyPara

      segments2 = $('table tr td:nth-child(2) p').length;
      nbEmptyPara = 0
      $('table tr td:nth-child(2) p').each(function() {
        if ($(this).text()=="") {nbEmptyPara = nbEmptyPara + 1}
      })
      segments2 = segments2 - nbEmptyPara

      if ((segments1 !== 0) && (segments2 !== 0)) {
        alignedSegments1 = $('table tr td:nth-child(1) p[id]').length;
        alignedSegments2 = $('table tr td:nth-child(2) p[id]').length;

        if ((alignedSegments1 !== 0) && (alignedSegments2 !== 0)) {
          stringA = alignedSegments1.toString() + '/' + segments1.toString() + ' <i>vs</i> ' +
                    alignedSegments2.toString() + '/' + segments2.toString()
          if ((alignedSegments1 == segments1) || (alignedSegments2 == segments2)) {
            stringA = stringA + " <b>Ready</b>"
          }
          $(".segcount").html(stringA)
        } else {
          string = segments1.toString() + ' <i>vs</i> ' + segments2.toString()
          $(".segcount").html(string)
        }
      }
    }

    showSegmentStat()

    // $('table').find('tr').click( function(){
    //   alert('You clicked row '+ ($(this).index()+1) );
    //   alert($(this).find('td:first').text());
    // });


    $('body').keyup(function(e){//Main commands
      e.preventDefault();

      if(e.keyCode == 39){ // right arrow
      }

      if(e.keyCode == 27){ //Reset color (escape)
        unselect()
      }

      if(e.keyCode == 40){ //Align/Unalign (down arrow)

        // test if selection in both source and target
         $('tr td p').filter(function() {
            return ( $(this).css('background-color') == selectedColor );
         }).attr("action", "yes");

        if (( $("tr td:nth-child(1) p[action=yes]").length > 0) &&
            ( $("tr td:nth-child(2) p[action=yes]").length > 0)) {

           newId = Math.random().toString( 16 ).slice( 2, 10 )
           idList = []
           var existingID;

           $('tr td p[action=yes]').each(function() {
             //console.log("processing p" + $(this).text())
             $(this).removeAttr('action');

             // record all ids
             var existingID = $(this).attr('id');
             if (typeof existingID !== typeof undefined && existingID !== false) { // id exists
               idList.push(existingID)
             }

             // align selected (with new id)
             $(this).attr("id", newId);
             $(this).css('background-color', alignedColor)
             $(this).attr("contentEditable", 'false');
             //$(this).css('border', '3px solid black');
             //$(this).css('border', borderDefault);

           })

          //console.log(idList)

           // also align previsously aligned:
           // for all ids in recordset
           for (index = 0; index < idList.length; ++index) {
                // for all segments with the current id
                $('tr td p[id=' + idList[index] + ']').each(function() {
                  // align (with new id)
                  //console.log("aligning cousins")
                  //console.log(idList[index] + " > " + newId)
                  $(this).attr("id", newId);
                  $(this).css('background-color', alignedColor)
                  $(this).attr("contentEditable", 'false');
                  //$(this).css('border', '3px solid black');
                })
            }

           // //trigger click on next pair of unaligned segments (Select)
           //
           // //take aligned segments and go next
           // $ ("tr td:nth-child(1) p[id=" + newId + "]").next().trigger( "click" );  //both for source
           // $ ("tr td:nth-child(2) p[id=" + newId + "]").next().trigger( "click" );  //and for target

           unselect()
         }//test source-target
       } //keycode

       if(e.keyCode == 38){ //Unalign (up arrow)
         $('tr td p').filter(function() {
            return ( $(this).css('background-color') == selectedColor );
         }).attr("action", "yes");

         $('tr td p[action=yes]').each(function() {
           $(this).removeAttr('action');
           var oldId = $(this).attr('id');
           if (typeof oldId !== typeof undefined && oldId !== false) { // id exists
             //remove
             ////console.log("removing " + oldId);
             ////console.log("removing alignment of p" + $(this).text())
             $(this).removeAttr('id');
             $(this).css('background-color', 'inherit');
             $(this).css('border', 'none');
             $(this).attr("contentEditable", 'true');
             //same treatment for same ids
             $("p[id=" + oldId + "]").each(function() {
               ////console.log("removing alignment of p with same id" + $(this).text())
               $(this).removeAttr('id');
               $(this).css('background-color', 'inherit');
               $(this).css('border', 'none');
               $(this).attr("contentEditable", 'true');
             })
           }
          });//treat

          // //trigger click on previous pair of aligned segments (Select)
          // $ ("tr td:nth-child(1) p[id=" + newId + "]").first().prev().trigger( "click" );  //both for source
          // $ ("tr td:nth-child(2) p[id=" + newId + "]").first().prev().trigger( "click" );  //and for target

        } //unalign

        showSegmentStat()
    });//keyup

    $(document).on('dblclick', 'tr td p:not([id])', function(e) {//Split (if not aligned)
        e.preventDefault()
        var selection = window.getSelection() || document.getSelection() || document.selection.createRange();
        var before = selection.focusNode.nodeValue.substr(0, selection.focusOffset - selection.toString().length)
        var after = selection.focusNode.nodeValue.substr(selection.focusOffset - selection.toString().length)

        $( this ).replaceWith("<p>" + before + "</p><p>" + after + "</p>");
        showSegmentStat()
    });

    $(document).on('mouseup', 'tr td', function() {//Merge
        selection = window.getSelection() || document.getSelection() || document.selection.createRange();

        startP = selection.getRangeAt(0).startContainer.parentNode
        endP = selection.getRangeAt(0).endContainer.parentNode

        parentTD = startP.parentNode

        indexstartP = Array.prototype.indexOf.call(parentTD.children, startP)
        indexendP = Array.prototype.indexOf.call(parentTD.children, endP)

        if (indexstartP < indexendP) {

         //console.log("Merging from " + indexstartP + " to " + indexendP)

          // prevent merge if aligned segments
          existAligned = false
          for (i = indexstartP; i <= indexendP; i++) {
            selString = "p:nth-child(" + (i + 1) + ")"
            idAttr = $(this).find(selString).attr('id')
            existAligned = existAligned || (typeof idAttr !== typeof undefined && idAttr !== false)
          }

          if (!existAligned) {
            //console.log("Merging")
            unionText = ""
            for (i = indexstartP; i <= indexendP; i++) {
              selString = "p:nth-child(" + (i + 1) + ")"
              unionText = unionText + $(this).find(selString).text()
            }

            for (i = indexendP; i >= indexstartP; i--) {
              selString = "p:nth-child(" + (i + 1) + ")"
              $(this).find(selString).remove();
            }

            if (indexstartP == 0) {
              $(this).prepend("<p>" + unionText + "</p>");
            }
            else {
              selString = "p:nth-child(" + indexstartP + ")"
              $(this).find(selString).after("<p>" + unionText + "</p>");
            }
            showSegmentStat()
          } else {
           //console.log("Merge not possible.")
          }
        }
    }); //Merge

    $(document).on('click', 'td p', function(e) {//Select (with trails)
        e.preventDefault()

        //reset borders
        //$("p[contentEditable=false]").css('border', borderDefault);

        //text_unselect() // prevent text autoselect

        //select segment
        select($(this))

        // highlight segments with same id
        var oldId = $(this).attr('id');

        if (typeof oldId !== typeof undefined && oldId !== false) { // id exists
          //console.log("Highlight all " + oldId)
          //$("p[id=" + oldId + "]").css('border', borderHighlighted);
          $("p[id=" + oldId + "]").each(function() { select($(this)) });
        }
    }); //Select

    window.onkeydown = function(e) {
      return !(e.keyCode == 32 && e.target == document.body);
    };

    $(".save").click(function(){//Save HTML document, including alignement
      $(".save").each(function() { $(this).attr("href", "") }); //clear previous content
      contentToSave = "<html>" + $("html").html() + "</html>"
      href_text = "data:application/text;base64," + window.btoa(unescape(encodeURIComponent(contentToSave)));
      $(this).attr("href", href_text)
    })

    // $("").mouseover(function(){// Highlight alignment
    //  //console.log("mouseover")
    //   id = $(this).attr('id')
    //   $("p[id=" + id + "]").css('border', '3px solid red');
    // });

    // $("td p[id]").hover(function(){
    //    //console.log("hover-start")
    // }, function(){
    //    //console.log("hover-end")
    // });

});//Ready
