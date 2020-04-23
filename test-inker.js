
/*

defines a global _testInky object

usage:

start/next playthrough:
    _testInky.test()

init a specific turn sequence:
    _testInky.seed_queue("2/1/0/2/0")

*/

(function() {

    let story_div

    function console_log() {
        //pass
    }

    function init() {
        story_div = document.getElementById("story")
        let el = document.createElement('div')
        //newEl.className = "event-list";
        //el.innerHTML = filteredDates[i].name;
        document.body.appendChild(el);

        el.style['background-color'] = "#EEE"
        el.style['position'] = "absolute"
        el.style['top'] = "0px"
        el.style['left'] = "0px"
        el.style['width'] = "1000px"
        el.style['height'] = "600px"
        el.style['border'] = "2px solid black"
        el.style['z-index'] = "6000"
        el.style['overflow'] = "auto"
        el.style['padding'] = "16px"

        output_div = el
    }

    let output_div

    function get_links(parent) {
        return [... parent.getElementsByTagName("a")]
    }

    let queue = {
        index: 0,
        list: [0], //important
        link_text_list: [],
        restarter: false,
    }

    function seed_queue(st) {
        let lst = st.split("/").
            map(n => n.trim()).
            filter(n => n)
        queue.list = lst
        queue.index = -1
        next_playthrough()
    }

    function next_playthrough() {
        total_output = ""
        output = ""
        nr_chain = ""
        restart_queue()
        for (let i = 0; i < 200; i++) {
            let result = queue_do_next()
            if (result === "done") break
            if (result === "playthrough done") break
        }
        console_log(total_output)
        output_div.innerHTML = `<a href="#"
        onclick="_testInky.next_playthrough()">NEXT PLAYTHROUGH</a>

        <br>${nr_chain}<br>You can pass this sequence
        or a similar one to _testInky.seed_queue:
        <br>_testInky.seed_queue("2/1/0/2/0")<br>
        `+total_output
    }


    let nr_chain = ""

    function restart_queue() {
        //output += "\n\n### restart ###"
        init() // a bit wasteful. but for safety
        output+="\n"
        restart_story()
        queue.index = -1
        queue.link_text_list = []

    }

    function restart_story() {
        document.getElementById("rewind").click()
    }


    let visited = {}

    let MAX_DEPTH = 1000 //dumb avoid endless loops

    let LOOP_DETECTION = true //clever avoid endless loops

    let output = ""
    let total_output = ""

    function queue_do_next() {
        console_log("%c ########## (", "background-color: orange;")
        console_log(queue.list)


        let result = queue_next()

        if (result !== "ok" && result !== "no more links on page") {
            output += " ### end result: "+result
        }
        
        if (result === "no more links on page") {
            //tried to follow non-existing link
            //discard output
            output = ""
            if (queue.list.length <=1) {
                //DOOOOOOOOOOOOOOOONE
                return "done"
            }
        }

        let playthrough_done = false

        if (result !== "ok" && output) {
            total_output += `<div style='
                color: #000;
                font-weight: bold;
                border-top: 4px solid red;
                margin-top: 10px;
            '>`+output+"</div>"
            let html = story_div.innerHTML
            total_output += "<div>"+html+"</div>"
            output = ""
            playthrough_done = true
        }


        if (result === "reached empty page" ||
            result === "no more links on page" ||
            result === "loop detected" ||
            queue.list.length >= MAX_DEPTH
            ) {
            //remove last list entry, increment second-to-last entry
            queue.list.pop()
            queue.list[queue.list.length - 1] ++
            restart_queue()
        }

        if (playthrough_done) return "playthrough done"
        console_log(queue.list, result)
        console_log("%c ) ##########", "background-color: orange;")

    }

    function queue_next() {
        queue.index++
        let item
        if (queue.index >= queue.list.length) {
            queue.list.push(0)
        }
        item = queue.list[queue.index]
        let html = story_div.innerText || story_div.textContent
        let links = get_links(story_div)
        console_log(html)
        if (links.length === 0) {
            //no more links
            return "reached empty page"
        }
        if (links[item]) {
            let txt = links[item].innerText

            if (LOOP_DETECTION) {
                let repetition = false
                if (visited[txt]) {
                    //output += "(---"
                    let max = 5
                    let vis = 0
                    let most_recent = txt
                    let one_before = queue.link_text_list[queue.index-1]

                    for (let i = queue.index-2; i >= 0; i--) {
                        max --
                        if (max <= 0) break
                        let entry = queue.link_text_list[i]
                        if (entry === most_recent || entry === one_before) {
                            vis ++
                        }
                        if (vis >= 3) repetition = true
                        //output += "backtracking: "+ entry
                    }
                    //output += "---)"
                }
                visited[txt] = true
                if (repetition) {
                    output += "*** POSSIBLE LOOP DETECTED - ABORTING ***"
                    return "loop detected"
                }
            }

            let col_nr = "black"
            if (item === 0) col_nr = "grey" 
            if (item === 1) col_nr = "red" 
            if (item === 2) col_nr = "green" 
            if (item === 3) col_nr = "coral" 
            if (item === 4) col_nr = "midnightblue" 
            if (item === 5) col_nr = "tomato" 
            if (item === 6) col_nr = "rebeccapurple" 

            nr_chain += item+ "/"
            output += txt + "<span style='color:"+col_nr+"'>("+item+")</span>, "
            queue.link_text_list.push(txt)
            links[item].click()
            return "ok"
        } else {
            console_log("no more links on page", item)
            return "no more links on page"
        }
            
    }

    window._testInky = {
        next_playthrough: next_playthrough, //needed for hacky inline links

        nextPlaythrough: next_playthrough, 
        
        seedQueue: seed_queue,

        test: n => {
            init()
            next_playthrough()
        },
    }




})()
