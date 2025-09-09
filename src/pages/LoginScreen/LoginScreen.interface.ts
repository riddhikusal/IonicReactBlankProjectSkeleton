export interface RegistrationForm {
    board: string;
    class: string;
    language_medium: string;
    language_native: string;
}

export interface LoginForm {
    phone_no: string;
    email: string;
    password: string;
    registration_form: RegistrationForm;
    login_screen_state_and_school_selection: LoginScreenStateAndSchoolSelection;
};

export interface LoginScreenStateAndSchoolSelection {
    state: string;
    school: string;
}


export const defaultRegistrationForm: RegistrationForm = {
    board: '',
    class: '',
    language_medium: '',
    language_native: '',
}

export const defaultLoginScreenStateAndSchoolSelection: LoginScreenStateAndSchoolSelection = {
    state: '',
    school: '',
}

export const defaultLoginForm: LoginForm = {
    phone_no: '',
    email: '',
    password: '',
    registration_form: defaultRegistrationForm,
    login_screen_state_and_school_selection: defaultLoginScreenStateAndSchoolSelection,
};