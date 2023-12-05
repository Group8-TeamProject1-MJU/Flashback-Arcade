import { createContext, useContext, useEffect, useState } from 'react';
import Modal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import Signin from '../pages/account/signin';

export const SigninModalContext = createContext(null);

export function SigninModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    function SignInModal() {
        return (
            <Modal
                styles={{
                    modal: {
                        background: `#010409`
                    }
                }}
                classNames={{
                    modal: "p-0 signin-mordal-section",
                }}
                open={isOpen}
                onClose={() => { setIsOpen(false) }}
            >
                <Signin />
            </Modal>
        )
    }

    return (
        <SigninModalContext.Provider
            value={{
                isOpen, setIsOpen, SignInModal
            }}
        >
            {children}
        </SigninModalContext.Provider>
    );
}
