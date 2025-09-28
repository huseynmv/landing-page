export type CreateSubmissionInput = {
    email: string;
};

export type StrapiFieldError = {
    path?: string[];
    message?: string;
    name?: string;
    extensions?: { code?: string };
};

export type StrapiError = {
    name?: string;
    message?: string;
    details?: { errors?: StrapiFieldError[] };
};

export type SubmissionOk = {
    status: "ok";
    id?: number;
};

export type SubmissionAlready = {
    status: "already";
};

export type SubmissionFailed = {
    status: "error";
    message?: string;
};

export type SubmissionResult = SubmissionOk | SubmissionAlready | SubmissionFailed;
