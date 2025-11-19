import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/modules/ProfilePage.module.css';
const backArrowImg = '/img/Rectangle 42215.svg';
const settingIconImg = '/img/setting_icon.svg';
const personImg = '/img/person.svg';

function ProfilePage() {
  const navigate = useNavigate();

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate('/agents_list');
  };

  const handleTariffClick = (e) => {
    e.preventDefault();
    navigate('/tariff');
  };

  return (
    <div className={`${styles.body} ${styles.profilePage}`}>
      <nav className={styles.navbar}>
        <div className="container-fluid d-flex justify-content-between px-0">
          <a className={styles.prev} href="#" onClick={handleBackClick} aria-label="Назад">
            <img src={backArrowImg} alt="Назад" />
          </a>
          <a className={styles.navbarAccount} href="#" aria-label="Настройки">
            <div className={styles.accountIcon}>
              <img src={settingIconImg} alt="Настройки" />
            </div>
          </a>
        </div>
      </nav>

      <div className={styles.glow} aria-hidden="true"></div>

      <div className={styles.contentBlock}>
        <h2 className={styles.profileTitle}>ПРОФИЛЬ</h2>
      </div>

      <div className={`${styles.contentBlock} d-flex align-items-center`}>
        <div className={styles.avatarBlock}>
          <img src={personImg} alt="Аватар профиля" width="30" height="30" />
        </div>
        <div className={styles.infoBlock}>Имя Фамилия</div>
      </div>

      <div className={styles.contentBlock}>
        <span className={styles.sectionTitle}>ВАША РОЛЬ:</span>
        <div className="d-flex align-items-center">
          <div className={styles.addRole}>Добавить роль +</div>
          <div className={styles.addRole}>Добавить роль +</div>
        </div>
      </div>

      <div className={styles.contentBlock}>
        <span className={styles.sectionTitle}>СФЕРА ДЕЯТЕЛЬНОСТИ:</span>
        <div className="input-block">
          <input className={styles.personActivity} type="text" placeholder="Укажите вашу сферу деятельности.."
            aria-label="Сфера деятельности" />
        </div>
      </div>

      <div className={styles.contentBlock}>
        <a className={styles.linkCorporatePage} href="#" onClick={handleTariffClick}>Тарифы</a>
      </div>

      <div className={`${styles.contentBlock} d-flex flex-column gap-3`}>
        <a className={styles.linkCorporatePage} href="">Политика конфиденциальности</a>
        <a className={styles.linkCorporatePage} href="">Условия использования</a>
        <a className={styles.linkCorporatePage} href="">О сервисе</a>
      </div>

    </div>
  );
}

export default ProfilePage;

