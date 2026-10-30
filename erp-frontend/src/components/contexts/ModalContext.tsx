"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode
} from "react";

import ScheduleModal from "../modal/ScheduleModal";
import type { Schedule } from "@/app/types/Schedule";

import AlertModal, { AlertModalOptions } from "../modal/AlertModal";

import ProductionOrderModal from "../modal/ProductionOrderModal";
import type { ProductionOrder } from "@/app/types/ProductionOrder";

// ScheduleModal 설정 타입
interface ScheduleModalConfig {
  isOpen: boolean;
  year: number;
  month: number;
  selectedDate: number | null;
  schedules: Schedule[];
  setSchedules?: React.Dispatch<React.SetStateAction<Schedule[]>>;
};

// AlertModal 설정 타입
interface AlertModalConfig extends AlertModalOptions {
  isOpen: boolean;
  message: string;
  onConfirm?: () => void;
};

// ProductionOrderModal 설정 타입
interface ProductionOrderModalConfig {
  isOpen: boolean;
  order?: ProductionOrder;
  onCreated?: (order: ProductionOrder) => void;
  onUpdated?: (order: ProductionOrder) => void;
  onDeleted?: (orderId: string) => void;
};

// Context 타입
interface ModalContextType {
  scheduleModalConfig: ScheduleModalConfig;
  alertModalConfig: AlertModalConfig;
  productionOrderModalConfig: ProductionOrderModalConfig;

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
    options?: AlertModalOptions
  ) => void;

  openProductionOrderModal: (
    order: ProductionOrder,
    onCreated?: (order: ProductionOrder) => void,
    onUpdated?: (order: ProductionOrder) => void,
    onDeleted?: (orderId: string) => void
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
  // ProductionOrderModal 상태
  const [productionOrderModalConfig, setProductionOrderModalConfig] =
    useState<ProductionOrderModalConfig>({
      isOpen: false,
    });

  // ScheduleModal 열기 함수
  const openScheduleModal = useCallback((
    year: number,
    month: number,
    selectedDate: number | null,
    schedules: Schedule[],
    setSchedules?: React.Dispatch<React.SetStateAction<Schedule[]>>,
  ) => {
    setScheduleModalConfig({
      isOpen: true, year, month, selectedDate, schedules, setSchedules
    });
  }, []);
  // 갱신
  const updateScheduleModal = useCallback((schedules: Schedule[]) => {
    setScheduleModalConfig((prev) => (
      prev.schedules === schedules ? prev : { ...prev, schedules }
    ));
  }, []);

  // AlertModal 열기 함수
  const openAlertModal = useCallback((
    message: string,
    onConfirm?: () => void,
    options: AlertModalOptions = {},
  ) => {
    setAlertModalConfig({...options, isOpen: true, message, onConfirm});
  }, []);

  const openProductionOrderModal = useCallback((
    order: ProductionOrder,
    onCreated?: (order: ProductionOrder) => void,
    onUpdated?: (order: ProductionOrder) => void,
    onDeleted?: (orderId: string) => void,
  ) => {
    setProductionOrderModalConfig({
    isOpen: true,
    order,
    onCreated,
    onUpdated,
    onDeleted,
  });
  }, []);

  return (
    <ModalContext.Provider
    value={{
      scheduleModalConfig,
      alertModalConfig,
      productionOrderModalConfig,
      updateScheduleModal,
      openScheduleModal,
      openAlertModal,
      openProductionOrderModal,
    }}>
      {children}
      {/* 커스텀 모달 렌더링 */}
      <ScheduleModal
      key={`${scheduleModalConfig.year}-${scheduleModalConfig.month}-${scheduleModalConfig.selectedDate}-${scheduleModalConfig.isOpen}`}
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
      isOn={alertModalConfig.variant === "confirm"}
      message={alertModalConfig.message}
      variant={alertModalConfig.variant}
      description={alertModalConfig.description}
      confirmText={alertModalConfig.confirmText}
      cancelText={alertModalConfig.cancelText}
      onClose={() => setAlertModalConfig(
        (prev) => ({...prev, isOpen: false})
      )}
      onConfirm={alertModalConfig.onConfirm}/>

      {productionOrderModalConfig.isOpen && (
        <ProductionOrderModal
        key={productionOrderModalConfig.order?.id ?? "create"}
        order={productionOrderModalConfig.order}
        onClose={() => setProductionOrderModalConfig(
          (prev) => ({...prev, isOpen: false})
        )}
        onCreated={productionOrderModalConfig.onCreated}
        onUpdated={productionOrderModalConfig.onUpdated}
        onDeleted={productionOrderModalConfig.onDeleted}/>
      )}
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