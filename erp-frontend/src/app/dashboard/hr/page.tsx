"use client";

import React, { useState } from "react";
import {Container, Row, Col, Card, Table, Badge,
  Button, InputGroup, Form } from "react-bootstrap";
import * as S from "@/assets/css/Style.styles";
import "@/assets/sass/styles.scss";

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  status: "active" | "leave" | "resigned";
  joinDate: string;
};

export default function Hr() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "EMP-001",
      name: "김철수",
      department: "개발팀",
      role: "수석 엔지니어",
      status: "active",
      joinDate: "2020-03-02"
    },
    {
      id: "EMP-002",
      name: "이영희",
      department: "인사팀",
      role: "팀장",
      status: "active",
      joinDate: "2019-11-15"
    },
    {
      id: "EMP-003",
      name: "박민수",
      department: "영업팀",
      role: "사원",
      status: "leave",
      joinDate: "2022-07-01"
    },
    {
      id: "EMP-004",
      name: "정지원",
      department: "디자인팀",
      role: "UI/UX 디자이너",
      status: "active",
      joinDate: "2021-05-20"
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge bg="success" pill className="px-3 py-2">
            재직중
          </Badge>
        );
      case "leave":
        return (
          <Badge bg="warning" pill className="px-3 py-2">
            휴직
          </Badge>
        );
      case "resigned":
        return (
          <Badge bg="danger" pill className="px-3 py-2">
            퇴사
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" pill className="px-3 py-2">
            알수없음
          </Badge>
        );
    };
  };

  return (
    <Container fluid className="py-4 mw1400">
      {/* 헤더 영역 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark m-0">
          인사 관리
        </h2>
        <Button variant="primary" className="fw-bold px-4">
          + 신규 직원 등록
        </Button>
      </div>

      {/* 요약 카드 영역 (Grid 레이아웃) */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">총 임직원 수</h6>
              <h3 className="text-success mb-0 fw-bold">
                {employees.length}명
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">이번 달 신규 입사</h6>
              <h3 className="text-primary mb-0 fw-bold">
                0명
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">현재 휴직자</h6>
              <h3 className="text-warning mb-0 fw-bold">
                {employees.filter(emp => emp.status === "leave").length}명
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 테이블 영역 */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <span className="fw-bold">임직원 목록</span>
          {/* 우측 검색창 */}
          <div style={{ width: "250px" }}>
            <InputGroup size="sm">
              <Form.Control placeholder="검색..." />
              <Button variant="outline-secondary">검색</Button>
            </InputGroup>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr className="bg-white border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">사번</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">이름</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">부서</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">직급/직책</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">상태</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">입사일</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{emp.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">{emp.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.role}</td>
                  <td className="px-6 py-4 text-sm text-center">{getStatusBadge(emp.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{emp.joinDate}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    <Button className="text-blue-600 hover:text-blue-800 font-medium mr-3">
                      수정
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};
