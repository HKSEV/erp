# 공통 UI 컴포넌트

업무 화면(생산·재고·인사·시스템관리)에서 Bootstrap·Tailwind 대신 쓰는 컴포넌트입니다.
색·간격은 모두 `assets/css/Theme.ts`의 테마 토큰을 사용합니다.

```tsx
import { PageHeader, StatGrid, StatCard, Card, SearchBar, DataTable, StatusBadge, Button, ProgressBar } from "@/components/ui";
import type { Column } from "@/components/ui";
```

## Bootstrap → 공통 컴포넌트 대응표

| 지금 코드 (Bootstrap / react-bootstrap) | 바꿀 코드 |
|---|---|
| `<h2 className="fw-bold">재고관리</h2>` + 오른쪽 `<Button>` | `<PageHeader title="재고관리" actions={<Button>+ 신규 품목 등록</Button>}/>` |
| `<Row><Col md={4}><Card>…</Card></Col>…</Row>` (요약 카드) | `<StatGrid><StatCard label="총 등록 품목" value={5} unit="개" tone="accent"/>…</StatGrid>` |
| `<Card><Card.Header>…</Card.Header><Card.Body className="p-0">` | `<Card title="현재고 현황" actions={…} noPadding>` |
| `<InputGroup><Form.Control/><Button>검색</Button></InputGroup>` | `<SearchBar placeholder="품목명 또는 코드 검색" onSearch={(keyword) => …}/>` |
| `<Table hover>` + `thead`/`tbody` 직접 작성 | `<DataTable columns={columns} rows={items} rowKey={(r) => r.id}/>` |
| `<Badge bg="success">정상</Badge>` | `<StatusBadge tone="success">정상</StatusBadge>` |
| `<Button variant="primary">` | `<Button>` |
| `<Button variant="outline-secondary" size="sm">` | `<Button variant="secondary" size="sm">` |
| `<Button variant="outline-danger" size="sm">` | `<Button variant="danger" size="sm">` |
| `<div className="progress"><div className="progress-bar" style={{width: "65%"}}/></div>` | `<ProgressBar value={65} label="PRD-001 진행률"/>` |

## 상태 색 (`tone`)

| tone | 쓰는 곳 |
|---|---|
| `success` | 정상, 완료, 재직 |
| `warning` | 재고부족, 대기, 휴직 |
| `danger` | 품절, 퇴사, 오류 |
| `info` | 진행 중 |
| `neutral` | 취소, 알 수 없음 |

## DataTable 열 정의 예시

```tsx
const columns: Column<InventoryItem>[] = [
  { key: "id", header: "품목 코드" },                                   // 값을 그대로 표시
  { key: "stock", header: "현재고", align: "right",                    // 숫자는 오른쪽 정렬
    render: (row) => row.stock.toLocaleString() },
  { key: "status", header: "상태", align: "center",
    render: (row) => <StatusBadge tone="success">정상</StatusBadge> },
  { key: "actions", header: "관리", align: "center",
    render: (row) => <Button size="sm" variant="secondary" onClick={() => edit(row)}>수정</Button> },
];
```

- 셀 강조 규칙: 코드·번호 열은 `variant: "code"`(회색, 보통 굵기), 행을 대표하는 이름 열은 `variant: "primary"`(굵게). 한 행에서 굵은 글씨는 이름 한 곳만 씁니다.
  ```tsx
  { key: "id", header: "품목 코드", variant: "code" },
  { key: "name", header: "품목명", variant: "primary" },
  ```
- 행이 없으면 `emptyText`(기본값: "데이터가 없습니다.")가 표시됩니다.
- 표가 화면보다 넓으면 표만 가로로 스크롤됩니다.

## 주의

- 기존 `S.Button`(`@/assets/css/Style.styles`)은 로그인·회원가입 화면에서 쓰고 있어 그대로 둡니다. 업무 화면에서는 이 폴더의 `Button`을 씁니다.
- 공통 컴포넌트는 `Style.styles.ts`에 넣지 않습니다. 기존 스타일과 이름이 겹치는 문제를 피하기 위해서입니다.
