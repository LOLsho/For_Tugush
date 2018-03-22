var line_text = [];
var text_input = document.querySelector('.ticker__text');
var running_line = document.querySelector('.line__running');
var running_line2 = document.querySelector('.line__running2');

var add_btn = document.querySelector('.ticker__btn');
var minus_btn = document.querySelector('.speed__minus');
var plus_btn = document.querySelector('.speed__plus');
var speed_input = document.querySelector('.speed__value');
var cycle = document.querySelector('.ticker__сycle-check');


// Скорость бегущего текста
var speed = speed_input.value;

// Длина бегущего текста
var text_width = running_line.clientWidth; 

// Длина всей строки, в которой движется текст
var line_width = document.querySelector('.line__wrap').clientWidth;

// На сколько смещен текст у первой и второй строки (вторая нужна для того, чтобы выходить с начала строки, пока первая еще не полностью ушла за конец)
var left = 0;
var left2 = 0;

// Переменная для проверки таймера
var isThereInterval = false;

// При запуске, строка начинает двигаться
var first_time = true;



// Клик по кнопке минус
minus_btn.addEventListener('click', function() {
	if (speed > -999) {
		speed = speed_input.value - 1;
		speed_input.value = speed;
		if (text_width) {
			MoveLineText();
		}
	}
});



// Клик по кнопке плюс
plus_btn.addEventListener('click', function() {
	if (speed < 999) {
		speed = +speed_input.value + 1;
		speed_input.value = speed;
		if (text_width) {
			MoveLineText();
		}
	}
});



//Изменение поля скорости с помощью вмешательства клавиатуры
speed_input.addEventListener('keyup', function() {
	speed = speed_input.value;

	if (text_width) {
		MoveLineText();
	}
})



// Клик по кнопке "Добавить"
add_btn.addEventListener('click', function(event) {
	event.preventDefault();
	var text = '';

	if (text_input.value) {
		line_text[line_text.length] = text_input.value;
	}

	for(var i=0; i < line_text.length; ++i) {
		if (i == 0) {
			text = line_text[i];
		} else {
			text = text + ' ' + '&nbsp;' + '|' + '&nbsp;' + ' ' + line_text[i];
		}
		
		running_line.innerHTML = text;
		running_line2.innerHTML = text;
	}

	// Очищаем поле ввода
	text_input.value = '';

	// Переписываем длину бегущей строки
	text_width = running_line.offsetWidth;

	// Убираем строку влево, чтобы у нее была возможность красиво выехать ;)
	if (first_time) {
		
		if (speed < 0) {
			left = line_width;
			running_line.style.marginLeft = line_width + 'px';

			left2 = -2000;
			running_line2.style.marginLeft = -2000 + 'px';
		} else {
			left = -(text_width);
			running_line.style.marginLeft = -(text_width) + 'px';

			left2 = 2000;
			running_line2.style.marginLeft = 2000 + 'px';
		}
		
		first_time = false;
	}

	// Запускаем бег строки, если она не пуста
	if (text_width) {
		MoveLineText();
	}
});


function MoveLineText() {
	// Если уже есть интервал, то отключаем его
	if (isThereInterval) {
		clearInterval(timerId);
		isThereInterval = false;
	}

	// Устанавливаем новый интервал
	// Сделал переменную глобальной, потому что иначе другие функции ее не видели
	window.timerId = setInterval(function() {
		// Интервал установлен
		isThereInterval = true;
		// console.log(text_width);

		left += speed/10;
		running_line.style.marginLeft = left + 'px';

		left2 += speed/10;
		running_line2.style.marginLeft = left2 + 'px';

		if (cycle.checked) {
			if (speed >= 0) {
				if (text_width < line_width) {

					if (text_width + left > line_width & left2 > line_width) {
						left2 = -(text_width);
						running_line2.style.marginLeft = -(text_width) + 'px';
					}

					if (text_width + left2 > line_width & left > line_width) {
						left = -(text_width);
						running_line.style.marginLeft = -(text_width) + 'px';
					}
				} else {

					if (left < left2) {

						if (left2 > line_width) {
							left2 = line_width + text_width;
							running_line2.style.marginLeft = line_width + text_width + 'px';
						}
						

						if (text_width + left > line_width & left > 50) {
							left2 = -(text_width);
							running_line2.style.marginLeft = -(text_width) + 'px';
						}

					} else {

						if(left > line_width) {
							left = line_width + text_width;
							running_line.style.marginLeft = line_width + text_width + 'px';
						}
						
						if (text_width + left2 > line_width & left2 > 50) {
							left = -(text_width);
							running_line.style.marginLeft = -(text_width) + 'px';
						}
					}
				}
			} else {
				if (text_width < line_width) {

					if (left < 0 & left2 + text_width < 0) {
						left2 = line_width;
						running_line2.style.marginLeft = line_width + 'px';
					}

					if (left2 < 0 & left + text_width < 0) {
						// console.log('я тут ');
						left = line_width;
						running_line.style.marginLeft = line_width + 'px';
					} 
				} else {

					if (left > left2) {
						if (left2 + text_width < 0) {
							left2 = -(text_width);
							running_line2.style.marginLeft = -(text_width) + 'px';
						}

						if (left < 0 & left + text_width < line_width - 50) {
							left2 = line_width;
							running_line2.style.marginLeft = line_width + 'px';
						}
					} else {
						if (left + text_width < 0) {
							left = -(text_width);
							running_line.style.marginLeft = -(text_width) + 'px';
						}

						if (left2 < 0 & left2 + text_width < line_width - 50) {
							left = line_width;
							running_line.style.marginLeft = line_width + 'px';
						}
					}
				}
			}
		} else {
			if (speed > 0) {
				if (left + text_width > 0 & left < line_width |
					left2 + text_width > 0 & left2 < line_width) {

				} else if (left > line_width) {
					left = -(text_width);
					running_line.style.marginLeft = -(text_width) + 'px';
					
					clearInterval(timerId);
				}
			} else {
				if (left < line_width & left + text_width > 0 |
					left2 < line_width & left2 + text_width > 0) {

				} else if (left + text_width < 0) {
					left = line_width;
					running_line.style.marginLeft = line_width + 'px';
					
					clearInterval(timerId);
				}
			}	
		}	
	}, 10);
}