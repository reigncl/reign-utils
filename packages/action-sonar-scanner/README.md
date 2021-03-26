# Hello world docker action

This action sonar scanner to projects with NodeJS.

## Example usage

```yaml
uses: reigncl/reign-utils/packages/action-sonar-scanner@master
env:
  SONAR_HOST_URL: ${{ secrets.SONAR_HOSTURL }}
  SONAR_LOGIN: ${{ secrets.SONAR_LOGIN }}
```
