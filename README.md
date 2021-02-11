# AI Campus CCTV Project

## 🥚 프로젝트 개요

### 프로젝트 명

- 이상행동 감지 CCTV 서비스 - AI AMONG US

### 프로젝트 기간

- 2020.09.09 ~ 2020.09.23

### 프로젝트 목적

- 인공지능을 활용, CCTV화면상의 정상 상태와 이상 상태를 구분하여 이상 상태인 경우 사용자에게 알람을 전송하는 이상행동 감지 CCTV웹서비스 구현


## 🐣 개발 환경

### WEB
- Django, Nginx, gunicorn
- AWS EC2 Server

### MODELING
- Google Teachable Machine


## 🐥 세부 사항

- 사용자 편의를 위한 반응형 웹
- 회원가입과 로그인 기능을 통한 사용자 판별
- Google Teachable Machine을 사용하여 정상 상태와 이상 상태를 학습시킴
- 무분별한 알람을 방지하기 위하여 이상 상태가 일정 시간 이상 지속될 경우 사용자에게 알람을 전송하는 알고리즘 적용

