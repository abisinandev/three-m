export const SIP_TYPES = {
    // repositories
    SipRepository: Symbol.for("SipRepository"),
    SipInstallmentRepository: Symbol.for("SipInstallmentRepository"),

    // usecases
    SipCreationUseCase: Symbol.for("SipCreationUseCase"),
    ExecuteDueSipUseCase: Symbol.for("ExecuteDueSipUseCase"),
    SipDetailsUseCase: Symbol.for("SipDetailsUseCase"),
    UserSipDetailsUseCase: Symbol.for("UserSipDetailsUseCase"),
    PauseSipUseCase: Symbol.for("PauseSipUseCase"),
    CancelSipUseCase: Symbol.for("CancelSipUseCase"),
    ResumeSipUseCase: Symbol.for("ResumeSipUseCase"),

    // controllers
    MutualFundSipController: Symbol.for("MutualFundSipController"),
};
