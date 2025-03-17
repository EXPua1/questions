import React, { useEffect, useRef, useState } from 'react';
import ActionMenu from '../ActionMenu/ActionMenu';
import css from './QuestionnaireCard.module.css'
import { BsThreeDotsVertical } from "react-icons/bs";

const QuestionnaireCard = ({ id, name, description, questionCount, completions, onDelete }) => {
    const [showActions, setShowActions] = useState(false);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
           
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowActions(false);
            }
        };

        if (showActions) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showActions]);

    return (
        <div className={css.card}>
            <button
                ref={buttonRef}
                className={css.actionButton}
                onClick={() => setShowActions(!showActions)}
            >
                <BsThreeDotsVertical size={20} />
            </button>
            {showActions && (
                <div className={css.actionMenu} ref={menuRef}>
                    <ActionMenu id={id} onDelete={onDelete} onClose={() => setShowActions(false)} />
                </div>
            )}
            <div>
                <h3>{name}</h3>
                <p>{description}</p>
            </div>
            <p>Questions: {questionCount}</p>
        </div>
    );
};

export default QuestionnaireCard;
