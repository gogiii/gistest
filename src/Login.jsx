import React from 'react';
import { Button, Form, Input, Layout } from 'antd';
import { Col, Row } from 'antd';

// dummy login form with onSubmit callback argument
export default function Login({ onSubmit }) {
    const layout = {
        labelCol: {
            span: 6
        },
        wrapperCol: {
            span: 12
        }
    }
    const submitLayout = {
        wrapperCol: {
            offset: 6,
            span: 12
        }
    };
    return (
        <Row align="middle" justify="center" type="flex" style={{minHeight: '100vh'}}>
            <Col span={12} offset={2}>
                <Form name="auth" {...layout} onFinish={onSubmit}>
                    <Form.Item label="Username" name="user" required={true}><Input /></Form.Item>
                    <Form.Item label="Password" name="password" required={true}><Input.Password /></Form.Item>
                    <Form.Item  {...submitLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};