import React, { createContext, useState, useContext, ReactNode } from "react";
import ScheduleModal, { Schedule } from "../modal/ScheduleModal";
import AlertModal, { AlertModalOptions } from "../modal/AlertModal";

// 1. ScheduleModal 설정 타입
interface ScheduleModalConfig {
  isOpen: boolean;
  year: number;
  month: number;
  selectedDate: number | null;
  schedules: Schedule[];
  setSchedules?: React.Dispatch<React.SetStateAction<Schedule[]>>;
};

// 2. AlertModal 설정 타입
interface AlertModalConfig extends AlertModalOptions {
  isOpen: boolean;
  message: string;
  onConfirm?: () => void;
};

// 3. Context 타입
interface ModalContextType {
  scheduleModalConfig: ScheduleModalConfig;
  alertModalConfig: AlertModalConfig;
  openScheduleModal: (
    year: number,
    month: number,
    selectedDate: number | null,
    schedules: Schedule[],
    setSchedules?: React.Dispatch<React.SetStateAction<Schedule[]>>
  ) => void;
  updateScheduleModal: (schedules: Schedule[]) => void;
  openAlertModal: (
    message: string,
    onConfirm?: () => void,
    options?: AlertModalOptions,
  ) => void;
};

// 3. Context 생성
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// 4. Provider 컴포넌트 생성
export function ModalProvider({children}: {children: ReactNode}) {
  // ScheduleModal 상태
  const [scheduleModalConfig, setScheduleModalConfig] = useState<ScheduleModalConfig>({
    isOpen: false,
    year: 2026,
    month: 1,
    selectedDate: null,
    schedules: [],
    setSchedules: undefined,
  });
  // AlertModal 상태
  const [alertModalConfig, setAlertModalConfig] = useState<AlertModalConfig>({
    isOpen: false,
    message: "",
  });

  // ScheduleModal 열기 함수
  const openScheduleModal = (
    year: number,
    month: number,
    selectedDate: number | null,
    schedules: Schedule[],
    setSchedules?: React.Dispatch<React.SetStateAction<Schedule[]>>,
  ) => {
    setScheduleModalConfig({
      isOpen: true, year, month, selectedDate, schedules, setSchedules
    });
  };
  // 갱신
  const updateScheduleModal = (schedules: Schedule[]) => {
    setScheduleModalConfig((prev) => ({...prev, schedules}));
  };

  // AlertModal 열기 함수
  const openAlertModal = (
    message: string,
    onConfirm?: () => void,
    options: AlertModalOptions = {},
  ) => {
    setAlertModalConfig({...options, isOpen: true, message, onConfirm});
  };

  return (
    <ModalContext.Provider
    value={{
      scheduleModalConfig,
      alertModalConfig,
      updateScheduleModal,
      openScheduleModal,
      openAlertModal
    }}>
      {children}
      {/* 커스텀 모달 렌더링 */}
      <ScheduleModal
      isOpen={scheduleModalConfig.isOpen}
      year={scheduleModalConfig.year}
      month={scheduleModalConfig.month}
      selectedDate={scheduleModalConfig.selectedDate}
      schedules={scheduleModalConfig.schedules}
      setSchedules={scheduleModalConfig.setSchedules!}
      onClose={() => setScheduleModalConfig(
        (prev) => ({...prev, isOpen: false})
      )}/>
      <AlertModal
      isOpen={alertModalConfig.isOpen}
      isOn={alertModalConfig.message.endsWith("?")}
      message={alertModalConfig.message}
      variant={alertModalConfig.variant}
      description={alertModalConfig.description}
      confirmText={alertModalConfig.confirmText}
      cancelText={alertModalConfig.cancelText}
      onClose={() => setAlertModalConfig(
        (prev) => ({...prev, isOpen: false})
      )}
      onConfirm={alertModalConfig.onConfirm}/>
    </ModalContext.Provider>
  );
};

// 4. Custom Hook 생성 (사용을 편하게 하기 위함)
export default function useModal() {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("useModal must be used within a ModalProvider");
  return context;
};