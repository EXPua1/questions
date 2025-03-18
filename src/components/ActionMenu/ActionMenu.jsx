import React from 'react';
import { Link } from 'react-router-dom';
import css from './ActionMenu.module.css';
const ActionMenu = ({ id, onDelete, onClose }) => {

    return (
        <div
            className={css.actionMenu}

        >
            <Link to={`/edit/${id}`} style={{ display: 'block', margin: '2px 0' }} onClick={onClose}>
                Edit
            </Link>
            <Link className={css.run} to={`/run/${id}`} style={{ display: 'block', margin: '2px 0' }} onClick={onClose}>
                Run
            </Link>
            <button className={css.actionButton} onClick={() => { onDelete(id); onClose(); }} style={{ margin: '2px 0' }}>
                Delete
            </button>
        </div>
    );
};

export default ActionMenu;