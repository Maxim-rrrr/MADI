import React, { Component } from 'react'

import Popup from './models/Popup'

class Support extends Component {

  render() {
    return (
      
      <Popup 
        active = { this.props.active }
        title = 'Справка' 
        close = { this.props.closeAllPopup }
      >
        <div className="support-popup">

          <span> Заметили ошибку в решении? </span>
          <span> Хотели бы видеть на нашем сайте, какой-то предмет, которого у нас нет? </span>
          <span> Хотите предложить сотрудничество? </span>
          <span> Пишите нам <a href = 'mailto:madi.rgr@yandex.ru'>madi.rgr@yandex.ru </a></span>
          
          <span>&nbsp;</span>

          <span> Решения не пришли? </span>
          <span> Нашли баг? </span>
          <span> Есть предложения по функционалу на сайте? </span>
          <span> Тоже хотите себе сайт? </span>
          <span> Пишите напрямую программисту <a href = 'mailto:kewin.rrrr@gmail.com'>kewin.rrrr@gmail.com </a> </span>


          <span>&nbsp;</span>
          
          <span> Сереброва Вероника Сергеевна </span>
          <span> Самозанятый: ИНН 165051092088 </span>
          <span><a href="tel:+7 901 504 87-67"> +7 901 504 87-67 </a>  </span>
          
        </div>

      </Popup>
          
    )
  }
}



export default Support;