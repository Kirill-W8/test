

window.addEventListener('DOMContentLoaded',() => {
    const form = document.querySelector('form'),
          input = form.querySelector('input'),
          ul = form.querySelector('ul'),
          body = document.querySelector('body'),
          wrapper = document.querySelector('.input-wrapper'),
          cost = document.querySelector('.cost'),
          submitButton = document.querySelector('.submit');

    const  getData = async () => {                  //Получение объекта с городами
        const citysObject = await fetch('db.json')
              .then(response => response.json());

        return await citysObject;
    };

    let bts = [],
        areaId;
    const marginBtn = document.querySelector('.margin_btn');

    input.addEventListener('input', () => {
       input.value = input.value.replace(/[^А-Яа-я- ]/,'');
       ul.innerHTML = '';
       bts.length = 0;
        getData().then(res => {
            res.forEach(item => {
                const li = document.createElement('li'),            //Создаем динамические элементы 
                      button = document.createElement('button'),    //И помещаем их на страницу
                      span = document.createElement('span');

                bts.push(button);      

                const re = new RegExp(`${input.value}`,'ig');     //Фильтруем введенный в инпут 
                                                                  //текст и удаляем/добавляем
                                                                  //элементы 

                
                if(item.name.match(re)) { 
                    areaId = item.id;
                    button.textContent = 'Добавить';                            
                    li.style.cssText = 'display: flex;justify-content: space-between;';
                    span.textContent = `${item.name}`;
                    li.append(span);
                    li.append(button);
                    ul.append(li);
                } 

                button.addEventListener('click', e => {
                   e.preventDefault();
                   const target = e.target;
                   const btnForInput = button;  
                   btnForInput.style.cssText = 'position: absolute; right: 7px; bottom: 11px;';                   
                   
                   switch (target.textContent) {
                       case 'Добавить':
                            
                            wrapper.append(btnForInput);

                            bts.forEach(item => {
                                item.textContent = 'Добавить';
                            });   

                            ul.style.display = 'none';
                            input.value = e.target.parentNode.querySelector('span').textContent;
                            e.target.textContent = 'Удалить';

                            cost.style.display = 'block';
                            submitButton.style.display = 'block';
                            
                            cost.querySelector('input').value = '320.00 ';

        
                        break;

                       case 'Удалить':
                            
                            btnForInput.remove();
                            input.value = '';
                            e.target.textContent = 'Добавить';
                            cost.style.display = 'none';
                            submitButton.style.display = 'none';

                            removeMarginCost();

                        break;
                   }
                   
                   input.addEventListener('input',() => {
                       btnForInput.remove();
                       cost.style.display = 'none';

                       removeMarginCost();

                    });
                  });

            });
        
        });
    
        if(input.value.length > 1) {
            ul.style.display = 'block';
        } else {
            ul.style.display = 'none';
        }
       
        

    });

    function removeMarginCost() {
        try {
            document.querySelectorAll('.margin_cost').forEach(item => item.remove());
        } catch {
            console.log(1);
        }
    }

    body.addEventListener('click', (e) => {
        
        if (e.target === body || e.target === wrapper || e.target === form) {
            ul.style.display = 'none';
            
        }
    });



    marginBtn.addEventListener('click', e => {
        e.preventDefault();
        
        submitButton.remove();
        const newMargin = document.createElement('div');
        newMargin.classList.add('margin_cost');
        newMargin.innerHTML = `
        
            
            <input name="min_weight" class="weigth" type="text">
            <span class="rubble">кг -</span>
            <input name="max_weight" class="weigth" type="text">
            <span class="rubble">кг</span>
            <input name="charge_value" class="margin_cost_input" type="text">
            <span class="rubble">₽</span>
            <button class="margin_btn calc">Удалить наценку</button>
            <div class="finish_cost-wrapper">
                 <span class="finish_cost">Итоговая стоимость: <span class="sum"></span>₽</span>
            </div>
            
        
        `;

        form.append(newMargin);
        form.append(submitButton);
        validationInputs();
        newMargin.querySelector('.margin_cost_input').addEventListener('input', e => {
            const finalValue = +document.querySelector('.basic_cost').value + (+e.target.value);
            if (finalValue) {
                newMargin.querySelector('.sum').textContent = `${finalValue}.00`;
            } else {
                newMargin.querySelector('.sum').textContent = `Неверное значение`;
            }
            
        });
        

        newMargin.querySelector('.calc').addEventListener('click', e => {
            e.preventDefault();
            newMargin.remove();
        });
        
    });

    function validationInputs() {
        const inputs = document.querySelectorAll('input');

        inputs.forEach((item, i) => {
            if (i > 0) {
                item.addEventListener('input', () => {
                    item.value = item.value.replace(/[^\d-+.]/,'');
                    item.style.borderColor = '';
                });
            }
        });
    }

    validationInputs();

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });

        return await res.text();
    };
    
    form.addEventListener('submit', e => {
        e.preventDefault();
        let crutch = 0;

        const formData = new FormData(form);
        formData.append('rate_area_id', areaId);

        document.querySelectorAll('input').forEach(item => {
            if (item.value == '' || item.value == ' ') {
                item.value = 'Заполните поле';
                item.style.borderColor = 'red';
                crutch++;                
            }
        });

        if (crutch === 0) {
        postData('assets/server.php', formData)
        .then(res => {console.log(res);});
           
        }


    });

   
    

    

    
    


    
    
    

});









    

