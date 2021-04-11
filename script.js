/*  add new todo  */
const form = document.getElementById('form');
const input = document.getElementById('input');
const dropzone = document.getElementById('dropzone');

retrieveTodos();

form.addEventListener('submit', submit);

function submit(event) {
	event.preventDefault();

	//selecionando uma cor aleatoria para o status
	let randomColor = Math.floor(Math.random() * 16777215).toString(16);

	if(input.value !== '') {
		let todoId = Math.floor(Math.random() * Date.now()); //cria um id aleatorio para o todo

		dropzone.insertAdjacentHTML('afterbegin', '<div class="card" draggable="true" data-id="'+todoId+'" ondragstart="dragstart(event)" ondragend="dragend(event)""><div class="status color"></div><div class="content">'+input.value+'</div></div>');
		document.querySelector('.color').style.backgroundColor = '#'+randomColor;

		if(localStorage.todo) {
			let todos = JSON.parse(localStorage.todo);
			let todoJson = {
				"todo" : input.value,
				"state" : "todo", //será todo por padrão quando criado
				"id" : todoId
			}

			//adiciona o novo todo ao json
			todos.push(todoJson);
						
			//sobescreve o todo com o novo todo
			localStorage.todo = JSON.stringify(todos);
		} else {
			let todoArray = [{
				"todo" : input.value,
				"state" : "todo",
				"id" : todoId
			}]
			localStorage.todo = JSON.stringify(todoArray);
		}

		input.value = '';
	}

}

function retrieveTodos() {
	if(localStorage.todo) {//caso nao exista retorna undefined e invalida o if
		let todoParse = JSON.parse(localStorage.todo);
		for (var i = 0; i < todoParse.length; i++) {
			const stateDropzone = document.querySelector('[data-state='+todoParse[i].state+']');
			stateDropzone.insertAdjacentHTML('afterbegin', '<div class="card" draggable="true" data-id="'+todoParse[i].id+'" ondragstart="dragstart(event)" ondragend="dragend(event)"><div class="status color"></div><div class="content">'+todoParse[i].todo+'</div></div>');
			let randomColor = Math.floor(Math.random() * 16777215).toString(16);
			document.querySelector('.color').style.backgroundColor = '#'+randomColor;
		}
	}
}

/*  drag & drop  */

//event.target = card
function dragstart(event) {
	event.target.classList.add('is-dragging');
}


function dragend(event) {
	event.target.classList.remove('is-dragging');
}

//event.target = dropzone
function dragover(event) {
	if(event.target.id == 'dropzone') { //para nao confundir com o proprio card
		const cardBeingDragged = document.querySelector('.is-dragging');
		event.target.classList.add('over');
		event.dataTransfer.dropEffect = 'move';
		event.preventDefault();
		event.target.append(cardBeingDragged);
	}
}

function dragleave(event) {
	event.target.classList.remove('over');
}

function drop(event) {
	event.target.classList.remove('over');
	const cardBeingDragged = document.querySelector('.is-dragging');
	const todos = JSON.parse(localStorage.todo);
	if(event.target.id == 'dropzone') {
		event.target.append(cardBeingDragged);
	}

	//muda o state do todo quando é dropado
	for(var i = 0; i < todos.length; i++) {
		if(todos[i].id == cardBeingDragged.dataset.id) {
			todos[i].state = event.target.dataset.state;
			localStorage.todo = JSON.stringify(todos);
			break;
		}
	}
}

/* drop to delete */

function dragoverDelete(event) {
	event.target.classList.add('over');
	event.dataTransfer.dropEffect = 'move';
	event.preventDefault();
}

function dropDelete(event) {
	event.target.classList.remove('over');
	const cardBeingDragged = document.querySelector('.is-dragging');
	const todos = JSON.parse(localStorage.todo);
	
	cardBeingDragged.style.display = 'none';

	for(var i = 0; i < todos.length; i++) {
		if(todos[i].id == cardBeingDragged.dataset.id) {
			todos.splice(i, 1);
			localStorage.todo = JSON.stringify(todos);
			break;
		}
	}
}