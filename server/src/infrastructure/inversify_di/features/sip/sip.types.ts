export const SIP_TYPES = {
    // repositories
    SipRepository: Symbol.for("SipRepository"),
    SipInstallmentRepository: Symbol.for("SipInstallmentRepository"),

    // usecases
    SipCreationUseCase: Symbol.for("SipCreationUseCase"),
    ExecuteDueSipUseCase: Symbol.for("ExecuteDueSipUseCase"),
    DispatchSipInstallmentsUseCase: Symbol.for("DispatchSipInstallmentsUseCase"),
    SipDetailsUseCase: Symbol.for("SipDetailsUseCase"),
    UserSipDetailsUseCase: Symbol.for("UserSipDetailsUseCase"),
    PauseSipUseCase: Symbol.for("PauseSipUseCase"),
    CancelSipUseCase: Symbol.for("CancelSipUseCase"),
    ResumeSipUseCase: Symbol.for("ResumeSipUseCase"),
    SipBlockUseCase: Symbol.for('SipBlockUseCase'),
    AnalyzeFailedInstallmentsUseCase: Symbol.for("AnalyzeFailedInstallmentsUseCase"),
    // controllers
    MutualFundSipController: Symbol.for("MutualFundSipController"),

    // queue
    SipQueue: Symbol.for("SipQueue"),
    SipWorker: Symbol.for("SipWorker"),
    SipScheduler: Symbol.for("SipScheduler"),
    FailedSipScheduler: Symbol.for("FailedSipScheduler"),
};

